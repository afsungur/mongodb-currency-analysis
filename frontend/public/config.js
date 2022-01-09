ROOT_API_URL = "https://us-east-1.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/cryptocurrencyanalysis-mqfhc/service/HTTPServices/incoming_webhook"
window['getConfig'] = {
    "REACT_APP_ENDPOINT_LATEST_INFO": `${ROOT_API_URL}/latestInfo`,
    "REACT_APP_ENDPOINT_LIST_OF_CURRENCIES": `${ROOT_API_URL}/currency`,
    "REACT_APP_ENDPOINT_PARTICULAR_CURRENCY_DATA": `${ROOT_API_URL}/currencyData`,
    "REACT_APP_ENDPOINT_TOP_N_WORST_PERFORMERS": `${ROOT_API_URL}/topNworstPerformers`,
    "REACT_APP_ENDPOINT_EXAMPLE_DOCUMENT": `${ROOT_API_URL}/exampleDocument`,
    "REACT_APP_ENDPOINT_ADD_RULE": `${ROOT_API_URL}/addRule`,
    "REACT_APP_ENDPOINT_GET_RULES": `${ROOT_API_URL}/rules`,
    "REACT_APP_ENDPOINT_DELETE_RULE": `${ROOT_API_URL}/deleteRule`,
    "REACT_APP_ENDPOINT_GET_STATS": `${ROOT_API_URL}/ruleStatistics`
}


