var request = require('request');
var Q = require('q');

var shopify = {};

/* Config */

shopify.config = {};

shopify.config.url = "";
shopify.config.productsPageSize = 250;

/* Products */

shopify.products = {};

shopify.products.count =function() {
	var deferred = Q.defer();

	var url = shopify.config.url +
        "/admin/products/count.json";

    var options = {
        url: url
    };

	request.get(options, function(error, response, body) {
		var count = 0;
		var data = JSON.parse(body);
		count = data.count;
		deferred.resolve(count);
	});

	return deferred.promise;
}

shopify.products.all =function() {
	var deferred = Q.defer();

	shopify.products.count().then(function(count)
	{
		console.info("There are " + count + " products to import.");
		
		var pageSize = shopify.config.productsPageSize;
		var pages = Math.ceil(count / pageSize);
		var calls = [];

		for(var i = 0; i < pages; i++) {
			calls.push(shopify.products.getByPage(i+1, pageSize));
		}

		Q.all(calls).done(function(values) {
			var products = []
			values.forEach(function(result) {
				products = products.concat(result.products);
			})

			deferred.resolve(products);
		});
	});

	return deferred.promise;
}

shopify.products.getByPage =function(pageNumber, pageSize) {
	
	var deferred = Q.defer();

	var url = shopify.config.url +
        "/admin/products.json?" +
        "limit=" + pageSize +
        "&page=" + pageNumber;

    var options = {
        url: url
    };

	request.get(options, function(error, response, body) {
		var data = JSON.parse(body);
		deferred.resolve(data);
	});

	return deferred.promise;	
}

shopify.products.toAzureSearchDocuments =function(products){
	var documents = [];

	products.forEach(function(product, index) {
		var doc = {};
		doc.id = "" + product.id; // force string
		doc.title = product.title;
		doc.product_type = product.product_type;
		doc.vendor = product.vendor;
		doc.body_html = product.body_html;
		doc.handle = product.handle;

		if (product.images && product.images.length > 0) {
			doc.image = product.images[0].src;
		}

		var minPrice = product.variants[0].price;
		var maxPrice = 0;
		
		product.variants.forEach(function(variant) {
			if (variant.price < minPrice) {
				minPrice = variant.price;
			}
			if (variant.price > maxPrice) {
				maxPrice = variant.price;
			}
		});

		doc.min_price = minPrice;
		doc.max_price = maxPrice;
		
		var tags = product.tags.split(',');
		var totalTags = tags.length;
		// Current Search Index supports up to 5 custom tags
		if (totalTags >= 5) {
			totalTags = 5;
		}

		for(var i = 0; i < totalTags; i++) {
			doc["tag"+(i+1)] = tags[i].trim();
		}

		documents.push(doc);
	});

	return documents;
};

module.exports = shopify;