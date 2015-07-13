var request = require('request');
var config = require('../../config');
var Payloads = require('./Payloads');
var Q = require('q');
var Shopify = require('../Helpers/shopify');

var deleteIndex = function(){
    var deferred = Q.defer();
    var url = config.serviceURL +
        "/indexes/" + 
        config.indexName +
        "?api-version=" + config.apiVersion;

    var headers = {
    	'api-key': config.apiKey,
    	'Content-Type': 'application/json'
    };

    var options = {
        url: url,
        headers: headers,
        withCredentials: false
    };
    
    request.del(options, function(error, response, body){
    	console.info("delete index result: " + response.statusCode);
    	deferred.resolve();
    });

    return deferred.promise;
};

var createIndex = function(){
    var deferred = Q.defer();

    var url = config.serviceURL +
        "/indexes/" + 
        config.indexName +
        "?api-version=" + 
        config.apiVersion;

    var headers = {
        'api-key': config.apiKey,
        'Content-Type': 'application/json'
    };

    var options = {
        url: url,
        headers: headers,
        body: JSON.stringify(Payloads.indexPayload),
        withCredentials: false
    };
        
    request.put(options, function(error, response, body){
    	console.info("create index result: " + response.statusCode);
    	deferred.resolve();
    });

    return deferred.promise;
}


var getShopifyProducts = function() {
    var deferred = Q.defer();

    Shopify.products.all().then(function(products){ 
        deferred.resolve(products);
    });

    return deferred.promise;
}

var populateIndex =function(shopifyProducts) {
    var deferred = Q.defer();

    // convert from Shopify Products to Search Documents
    var docs = Shopify.products.toAzureSearchDocuments(shopifyProducts);

    var url = config.serviceURL +
        "/indexes/" + 
        config.indexName +
        "/docs/index" +
        "?api-version=" + 
        config.apiVersion;

    var headers = {
        'api-key': config.apiKey,
        'Content-Type': 'application/json'
    };

    var pageSize = config.maxItemsPerBatch;
    var pages = Math.ceil(docs.length / config.maxItemsPerBatch);
    var calls = [];

    for (var i = 0; i < pages; i++) {
        var uploadTask = function() {
            var deferred = Q.defer();

            var startOffset = i * pageSize;
            var endOffset = startOffset + pageSize;
            var pagedData = docs.slice(startOffset, endOffset);

            var options = {
                url: url,
                headers: headers,
                body: JSON.stringify({value: pagedData}),
                withCredentials: false
            };

            request.post(options, function(error, response, body){
                console.info("populated index [" + startOffset + " to " + (startOffset + pagedData.length) + "] result: " + response.statusCode);
                deferred.resolve();
            });                 

            return deferred.promise;
        }

        calls.push(uploadTask());

        Q.all(calls).done(function(){
            deferred.resolve();
        });
    }

    return deferred.promise;
}

/* Configure Shopify API */
Shopify.config.url = config.shopifyURL;

deleteIndex()
    .then(createIndex)
    .then(getShopifyProducts)
    .then(populateIndex);
