from datetime import datetime
from decimal import Decimal
from bson.decimal128 import Decimal128
import ast, logging, sys, json, pymongo, websockets, asyncio, os

# change logging.INFO to logging.DEBUG to debug websocket
logging.basicConfig(stream=sys.stdout, level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")


# mongodb timeseries database connection information
mongo_uri=f"{os.environ['MONGODB_DATABASE_URI']}"
connection = pymongo.MongoClient(mongo_uri)
db = connection["trading"]
collection = db["ticker"]

# returns the json message which is going to be send first to the websocket server
def get_subscribe_message():
    subscribe_request={
            "type": "subscribe",
            "product_ids": [
                "BTC-USD",
                "BTC-EUR",
                "BTC-GBP",
                "ETH-USD",
                "ETH-EUR",
                "ETH-BTC",
                "LTC-USD",
                "LTC-EUR",
                "LTC-BTC",
                "BCH-USD",
                "BCH-EUR",
                "BCH-BTC"
            ],
            "channels": [
                "ticker"
            ]
    }
    return subscribe_request

# Converts jsons string retrieved from websocket TO dict object
#
# Example json string retrieved from websocket:
# {"type":"ticker","sequence":16915973435,"product_id":"ETH-USD","price":"3457.3","open_24h":"3515.66","volume_24h":"527243.57034770","low_24h":"3101","high_24h":"3564.42","volume_30d":"11875675.35338143","best_bid":"3456.94","best_ask":"3457.30","side":"buy","time":"2021-05-18T09:52:14.103150Z","trade_id":115769862,"last_size":"0.0591"}
#
def get_currency(currency_json):
    currency = {}
    currency["symbol"] = currency_json["product_id"]
    timestamp = datetime.strptime(currency_json["time"], "%Y-%m-%dT%H:%M:%S.%fZ")
    currency["time"] = timestamp
    currency["price"] = float(currency_json["price"])
    return currency

# retrieves the price data, converts to dict object then insert into mongodb timeseries db
async def insert_ticks():
    logging.info("Websocket to coinbase is being established ...")
    async with websockets.connect(os.environ['CURRENCY_LOADER_URI'], ssl=True, ping_interval=50, ping_timeout=None) as websocket:
        logging.info("Successful: Websocket has been establised to COINBASE platform ...")
        await websocket.send(json.dumps(get_subscribe_message()))
        socket_message = await websocket.recv()
        logging.debug("First response from coinbase web socket: %s", socket_message)
        currency_list = []
        
        while (True):
            socket_message = await websocket.recv()
            currency_json=ast.literal_eval(socket_message)
            if (currency_json["type"] != "ticker"):
                continue
            
            currency = get_currency(currency_json)
            currency_list.append(currency)
            logging.info("Data retrieved from COINBASE websocket ...")
            if (len(currency_list) == 50):
                result=collection.insert_many(currency_list, ordered=False)
                print("==============================================================================")
                print(f"Now:{datetime.now()}: {len(currency_list)} currency data has been retrieved from socket and {len(result.inserted_ids)} of them have been inserted. Example retrieved record: {currency}.")
                print("==============================================================================")
                currency_list = []

def start_loader():
    asyncio.get_event_loop().run_until_complete(insert_ticks())
