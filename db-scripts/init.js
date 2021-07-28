use trading
db.ticker.drop()
const expireAfterSeconds=parseInt(_getEnv('MONGODB_TIMESERIES_EXPIRATION_SECONDS')) // READING ENVIRONMENT VARIABLE
db.createCollection("ticker",
    {
        "timeseries" : {
            "timeField" : "time",
            "metaField" : "symbol",
	    "granularity" : "seconds"
        },
        "storageEngine" : {
            "wiredTiger" : {
                "configString" : "block_compressor=zstd"
            }
        },
        "expireAfterSeconds": expireAfterSeconds
    }
)

db.ticker.createIndex({
    "symbol" : 1
})


db.ticker.createIndex({
    "time" : 1,
    "symbol" : 1
})

print("======================")
print("Collection details:")
db.getCollectionInfos()
print("======================")
print("Indexes:")
db.ticker.getIndexes()
