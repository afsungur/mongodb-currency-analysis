import crypto_binance_loader, crypto_coinbase_loader, sys
import logging, os

exchange_data_source=os.environ['CURRENCY_LOADER_TYPE'] # BINANCE or COINBASE
logging.info("Parameters: %s, %s", exchange_data_source , os.environ['CURRENCY_LOADER_URI'])
if (exchange_data_source == "binance"):
    crypto_binance_loader.start_loader()
elif (exchange_data_source == "coinbase"):
    crypto_coinbase_loader.start_loader()


