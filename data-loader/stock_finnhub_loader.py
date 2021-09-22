import websocket
import asyncio
import pymongo
import ast
import re
from datetime import datetime
from decimal import Decimal
from bson.decimal128 import Decimal128
import os
import sys
import logging
import json

logging.basicConfig(stream=sys.stdout, level=logging.INFO,
                    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")

websocket_uri = f"wss://ws.finnhub.io?token={os.environ['FINNHUB_TOKEN']}"
mongo_uri = f"{os.environ['MONGODB_DATABASE_URI']}"
connection = pymongo.MongoClient(mongo_uri)
db = connection["trading"]
collection = db["ticker"]


def get_currency(currency_json):
    currency = {}
    currency["symbol"] = currency_json["s"]
    timestamp = datetime.fromtimestamp(currency_json["t"]/1000)
    currency["time"] = timestamp
    currency["price"] = float(currency_json["p"])
    currency["volume"] = float(currency_json["v"])
    return currency


def on_message(ws, message):
    logging.info(f"Message received - {message}")

    # convert it
    currencies=json.loads(message)
    
    # get an example currency 
    currency=get_currency(currencies["data"][0])

    currency_list = []
    for currency_json in currencies["data"]:
        currency = get_currency(currency_json)
        currency_list.append(currency)
        
    result=collection.insert_many(currency_list, ordered=False)
    num_of_inserted_records=len(result.inserted_ids)
    logging.info(f"{len(currencies['data'])} currency data has been retrieved from socket and {num_of_inserted_records} of them have been inserted. Example retrieved record: {currency}.")

def on_error(ws, error):
    print(error)


def on_close(ws):
    print("### closed ###")

def on_open(ws):
    ws.send('{"type":"subscribe","symbol":"MDB"}')
    ws.send('{"type":"subscribe","symbol":"JPM"}')
    logging.info(
        "Successful: Websocket has been establised to FINNHUB platform ...")

async def insert_ticks():

    ws = websocket.WebSocketApp(websocket_uri,
                                on_message=on_message,
                                on_error=on_error,
                                on_close=on_close)
    ws.on_open = on_open
    ws.run_forever()


def start_loader():
    asyncio.get_event_loop().run_until_complete(insert_ticks())


if __name__ == '__main__':
    start_loader()
