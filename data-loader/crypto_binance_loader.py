import asyncio, websockets, pymongo, ast, re
from datetime import datetime
from decimal import Decimal
from bson.decimal128 import Decimal128
import os, sys, logging

logging.basicConfig(stream=sys.stdout, level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")

websocket_uri="wss://stream.binance.com:9443/ws/!ticker@arr"
mongo_uri=f"{os.environ['MONGODB_DATABASE_URI']}"
connection = pymongo.MongoClient(mongo_uri)
db = connection["trading"]
collection = db["ticker"]

def get_currency(currency_json):
    currency = {}
    currency["symbol"] = currency_json["s"]
    currency["time"]=int(str(currency_json["E"])[0:10])
    timestamp = datetime.utcfromtimestamp(currency["time"])
    currency["time"] = timestamp
    currency["price"] = float(currency_json["c"])
    currency["volume"] = float(currency_json["v"])

async def insert_ticks():
    # Write the below currencies into the database
    list_of_currencies_to_write=[
        "BNBBTC",
        "BNBBUSD",
        "DASHBUSD"
    ]

    # Write the currencies that matches the below REGEX rule into the database
    regex = '.*BTC.*'

    # dynamically evaluated after the JSON data retrieved that  includes all tickers data
    if_clause='((currency["symbol"] in list_of_currencies_to_write) or (re.match(regex, currency["symbol"])))'

    # Start websocket to binance
    async with websockets.connect(websocket_uri, ssl=True, ping_interval=50, ping_timeout=None) as websocket:
        logging.info("Successful: Websocket has been establised to BINANCE platform ...")
        while (True):
            # get the all currencies from the websocket
            socket_message = await websocket.recv()

            # convert it
            currencies=ast.literal_eval(socket_message)

            # get an example currency
            currency=get_currency(currencies[0])

            currency_list = []
            for currency_json in currencies:
                currency = get_currency(currency_json)
                # if the recieved currency matches the given rule, batch it to write later
                if (eval(if_clause)):
                    currency_list.append(currency)
                else:
                    continue

            result=collection.insert_many(currency_list, ordered=False)
            num_of_inserted_records=len(result.inserted_ids)
            logging.info(f"{len(currencies)} currency data has been retrieved from socket and {num_of_inserted_records} of them have been inserted. Example retrieved record: {currency}.")

def start_loader():
    asyncio.get_event_loop().run_until_complete(insert_ticks())