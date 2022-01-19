import crypto_binance_loader, crypto_coinbase_loader, stock_finnhub_loader ,sys
import logging, os
import traceback, time

exchange_data_source=os.environ['CURRENCY_LOADER_TYPE'] # BINANCE or COINBASE or FINNHUB
logging.info("Parameters: %s, %s", exchange_data_source )

while True:
    try:
        if (exchange_data_source == "binance"):
            crypto_binance_loader.start_loader()
        elif (exchange_data_source == "coinbase"):
            crypto_coinbase_loader.start_loader()
        elif (exchange_data_source == "finnhub"):
            stock_finnhub_loader.start_loader()
    except:
        traceback.print_exception(*sys.exc_info())
        logging.error("ERROR Occurred.. Will be retried in a few seconds ...")
        time.sleep(5)
