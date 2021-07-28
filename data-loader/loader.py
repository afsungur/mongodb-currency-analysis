import crypto_binance_loader, crypto_coinbase_loader, sys
import logging, os

logging.info("Parameters: %s, %s", sys.argv[1], os.environ['CURRENCY_LOADER_URI'])
if (sys.argv[1] == "binance"):
    crypto_binance_loader.start_loader()
elif (sys.argv[1] == "coinbase"):
    crypto_coinbase_loader.start_loader()


