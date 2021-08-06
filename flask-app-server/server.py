from flask import Flask, render_template, request, jsonify
import pymongo
import ssl
from bson import json_util
import json
import os


from flask_cors import CORS
app = Flask(__name__,             
            static_url_path='', 
            static_folder='templates/static',)
CORS(app)


mongo_uri=f"mongodb://{os.environ['MONGODB_DATABASE_HOSTNAME']}:{os.environ['MONGODB_DATABASE_PORT']}"
print(f"Trying to connect to the database: {mongo_uri}")
conn = pymongo.MongoClient(mongo_uri, ssl_cert_reqs=ssl.CERT_NONE)
collection_ticker = conn['trading']['ticker']

print(conn.server_info())
print("Database connection is successful.")
# endpoint for retriving all distinct currencies 
@app.route('/currency', methods=['GET'])
def list_currencies():
    print("[Request got]: GET - /currencies")
    agg_pipeline =  [
      {
          '$group' : {
            '_id' : "$symbol"
          }
      },
      {
          '$sort' : {
            "symbol" : 1
          }
      }
    ]
    
    docs = list(collection_ticker.aggregate(agg_pipeline))
    json_result = json.dumps(docs, indent=4)
    return jsonify(json_result)


@app.route('/currencyData', methods=['GET'])
def retrieve_currency_data():

    http_param_currency = request.args.get('currency', default=None, type=str)
    http_param_interval = request.args.get('interval', default=1, type=int)
    http_param_ma_1 = request.args.get('ma_1', default=None, type=int)
    http_param_ma_2 = request.args.get('ma_2', default=None, type=int)
    http_param_ema_1 = request.args.get('ema_1', default=None, type=int)
    http_param_ema_2 = request.args.get('ema_2', default=None, type=int)
    http_param_macd_1 = request.args.get('macd_1', default=None, type=int)
    http_param_macd_2 = request.args.get('macd_2', default=None, type=int)
    http_param_macd_signal = request.args.get('macd_signal', default=None, type=int)
    http_param_rsi = request.args.get('rsi', default=None, type=int)

    agg_pipeline =  [
    {
        "$match" : {
            "symbol" : http_param_currency
        }
    },
    {
        "$group" : {
            "_id" : { "symbol" : "$symbol" , "time": { "$dateTrunc" : {"date": "$time", "unit": "minute", "binSize" : http_param_interval}}},
            "high": {"$max" : "$price"},
            "low": {"$min" : "$price"},
            "open" : {"$first" : "$price"},
            "close" : {"$last" : "$price"}
        }
    },
    {
        "$sort" : {
            "_id.time" : 1
        }
    }
    ]


    # if moving average AND/OR exp moving average AND/OR MACD is requested, then it will add it 
    # to the agg pipeline
    if (http_param_ma_1 != None or http_param_ma_2 != None or http_param_ema_1 != None or http_param_ema_2 != None or http_param_macd_1 != None):
        ma_aggregation_stage = {
            "$setWindowFields" : {
                "partitionBy" : "$_id.symbol",
                "sortBy": { "_id.time" : 1 },
                "output" : {}
        }}
        if (http_param_ma_1 != None):
            ma_aggregation_stage['$setWindowFields']['output']['movingAverage01'] = {
                    "$avg" : "$close",
                    "window" : {"documents" : [-1*http_param_ma_1,0]}
            }

        if (http_param_ma_2 != None):
            ma_aggregation_stage['$setWindowFields']['output']['movingAverage02'] = {
                    "$avg" : "$close",
                    "window" : {"documents" : [-1*http_param_ma_2,0]}
            }

        if (http_param_ema_1 != None):
            ma_aggregation_stage['$setWindowFields']['output']['expMovingAverage01'] = {
                    "$expMovingAvg" : {"input" : "$close", "N" : http_param_ema_1}
            }
        if (http_param_ema_2 != None):
            ma_aggregation_stage['$setWindowFields']['output']['expMovingAverage01'] = {
                    "$expMovingAvg" : {"input" : "$close", "N" : http_param_ema_2}
            }
        if (http_param_macd_1 != None):
            ma_aggregation_stage['$setWindowFields']['output']['macd01'] = {
                    "$expMovingAvg" : {"input" : "$close", "N" : http_param_macd_1}
            }
            ma_aggregation_stage['$setWindowFields']['output']['macd02'] = {
                    "$expMovingAvg" : {"input" : "$close", "N" : http_param_macd_2}
            }
                

        agg_pipeline.append(ma_aggregation_stage)

    if (http_param_macd_1 != None):
        
        # macd line agg stage
        macd_diff_aggregation_stage = { "$addFields" : {"macdLine" : {"$subtract" : ["$macd01", "$macd02"]}}}
        agg_pipeline.append(macd_diff_aggregation_stage)

        # macd signal agg stage
        macd_signal_aggregation_stage = {
        "$setWindowFields" : {
            "partitionBy" : "$_id.symbol",
            "sortBy": { "_id.time" : 1 },
            "output" : {}
        }}
        macd_signal_aggregation_stage['$setWindowFields']['output']['macdSignal'] = { 
        "$expMovingAvg" : {"input" : "$macdLine", "N" : http_param_macd_signal}
        }
        agg_pipeline.append(macd_signal_aggregation_stage)

        # macd histogram agg stage
        macd_histogram_aggregation_stage = { "$addFields" : {"macdHistogram" : {"$subtract" : ["$macdLine", "$macdSignal"]}}}
        agg_pipeline.append(macd_histogram_aggregation_stage)
      

    if (http_param_rsi != None):

        one_previous_close_aggregation_stage = {
            "$setWindowFields" : {
            "partitionBy" : "$_id.symbol",
            "sortBy": { "_id.time" : 1 },
            "output" : {
                "prevClose" : {"$shift" : {"by" : -1, "output" : "$close"}}
            }
        }}
        price_difference_from_previous_one_aggregation_stage = { 
            "$addFields" : {
                "diff" : {"$subtract" : ["$close", {"$ifNull" : ["$prevClose","$close"]}]}
            }
        }
        gain_loss_aggregation_stage = {
            "$addFields" : {
                "gain" : {"$cond": { "if": { "$gte": [ "$diff", 0 ] }, "then": "$diff", "else": 0 }},
                "loss" : {"$cond": { "if": { "$lte": [ "$diff", 0 ] }, "then": {"$abs": "$diff"}, "else": 0 }},
            }
        }
        avg_gain_loss_last_n_points_aggregation_stage = {
            "$setWindowFields" : {
            "partitionBy" : "$_id.symbol",
            "sortBy": { "_id.time" : 1 },
            "output" : {
                "avgGain" : {
                    "$avg" : "$gain",
                    "window" : {"documents" : [-1*http_param_rsi,0]}
                },
                "avgLoss" : {
                    "$avg" : "$loss",
                    "window" : {"documents" : [-1*http_param_rsi,0]}
                },
                "rankNo" : { "$rank" : {}}
            }
        }}
        relative_strength_aggregation_stage = {
            "$addFields": {
                "relativeStrength": {
                    "$cond": {
                        "if": {
                            "$gt": ["$avgLoss",0]
                        },
                        "then" : {
                            "$divide": [
                                "$avgGain",
                                "$avgLoss"
                            ]
                        },
                        "else" : "$avgGain"
                    }
                }
            }
        }
        smooth_rsi_aggregation_stage = {
            "$addFields" : {
                "rsi" : {
                "$cond" : {
                    "if" : { "$gt": ["$rankNo", http_param_rsi]},
                    "then" : {"$subtract" : [100, {"$divide": [100, {"$add":[1, "$relativeStrength"]}]}]},
                    "else" : None
                }}
            }
        }
        agg_pipeline.append(one_previous_close_aggregation_stage)
        agg_pipeline.append(price_difference_from_previous_one_aggregation_stage)
        agg_pipeline.append(gain_loss_aggregation_stage)
        agg_pipeline.append(avg_gain_loss_last_n_points_aggregation_stage)
        agg_pipeline.append(relative_strength_aggregation_stage)
        agg_pipeline.append(smooth_rsi_aggregation_stage)



    print(f"This is the generated query: {agg_pipeline}")

    docs = list(collection_ticker.aggregate(agg_pipeline))
    json_result = ({"query":json.dumps(agg_pipeline,indent=4), "result": json.dumps(docs, default=str)})   
    return jsonify(json_result)


@app.route('/topNworstPerformers', methods=['GET'])
def topWorstPerformer():

    method = request.args.get('method', default=None, type=str)
    interval = request.args.get('interval', default=None, type=int)
    
    agg_pipeline =  [
    {
        "$match" : {
            "$expr" : {
                "$gt" : [{"$dateAdd" : {"startDate" : "$time", "unit": "minute", "amount":1440}},"$$NOW"]
            }
        }
    },
    {
        "$group" : {
            "_id" : { "symbol" : "$symbol" , "time": { "$dateTrunc" : {"date": "$time", "unit": "minute", "binSize" : interval}}},
            "high": {"$max" : "$price"},
            "low": {"$min" : "$price"},
            "open" : {"$first" : "$price"},
            "close" : {"$last" : "$price"}
        }
    },
    {
        "$addFields" : {
            "diffPercentage" : {"$round" : [{"$multiply" : [100, { "$divide" : [{"$subtract" : ["$close", "$open"]}, "$open"] }]},2]}
        }
    },
    {
        "$setWindowFields" : {
            "partitionBy" : "$_id.time",
            "sortBy": { "diffPercentage" : -1 if (method == "TOP") else 1 },
            "output" : {
                "rank" : { "$rank" : {}}
            }
        }
    },
    {
        "$match" : {"rank" : { "$lte" : 3}}
    },
    {
        "$group" : {
            "_id" : { "time" : "$_id.time"},
            "first3ForEachTimeGroup" : { "$push": "$$ROOT"} 
        }
    },
    {
        "$set" :{
            "first" : {
                "$arrayElemAt": [ "$first3ForEachTimeGroup", 0 ]
            },
            "second" : {
                "$arrayElemAt": [ "$first3ForEachTimeGroup", 1 ]
            },
            "third" : {
                "$arrayElemAt": [ "$first3ForEachTimeGroup", 2 ]
            },
            "first3ForEachTimeGroup" : "$$REMOVE"
        }
    },
    {
        "$sort" : {
            "_id.time" : -1
        }
    }
    ]
    print(agg_pipeline)
    
    docs = list(collection_ticker.aggregate(agg_pipeline))
    json_result = ({"query":json.dumps(agg_pipeline,indent=4), "result": json.dumps(docs, default=str)})   
    return jsonify(json_result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=os.environ['FLASK_APP_SERVER_PORT'], debug=True)
