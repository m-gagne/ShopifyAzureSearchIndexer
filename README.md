# Shopify Azure Search Indexer
 A NodeJS app that creates an Azure Search index and automatically populates it with products from a Shopify store.

## Getting Started

1. `git clone https://github.com/m-gagne/ShopifyAzureSearchIndexer.git`
1. `npm install`
1. Create a [Free/Paid Azure Search](https://azure.microsoft.com/en-us/documentation/articles/search-get-started/) instance
1. Create a [Private App](https://docs.shopify.com/api/authentication/creating-a-private-app) for your Shopify Store
1. Copy & edit the sample config file
	* `cp config.sample.js config.js`
1. Run the app
	* `npm run indexDocuments`

## Next Steps

You should now have an Azure Search index populated with products from your Shopify store. See the [Get started with Azure Search](https://azure.microsoft.com/en-us/documentation/articles/search-get-started/) for documentation and samples on how to search, navigate, auto-complete and more.

## Search Demo

Check out samples/Search/search.html for a sample search implementation or try out the [Live Demo](http://mgagne.blob.core.windows.net/public/Search/search.html).  
