var config = {};

// Azure Search API Key
config.apiKey = ""; 

// Azure Search Query Key
config.queryKey = ""; 

// Azure Search URL e.g https://my-sample-search.search.windows.net
config.serviceURL = "";

// Azure Search Index Name
config.indexName = "";

// Azure Search API Version
config.apiVersion = "2015-02-28";

// How many documents to send to Azure per POST
config.maxItemsPerBatch = 1000;

// Shopify Private APP URL including API Key & Password eg https://apikey:password@hostname 
config.shopifyURL = ""

module.exports = config;
