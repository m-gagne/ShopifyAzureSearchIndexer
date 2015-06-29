var config = require('../../config');
var payloads = {};

payloads.indexPayload = 
{
    "name": config.indexName,
    "fields": [
        {
            "name": "id",
            "type": "Edm.String",
            "searchable": false,
            "filterable": false,
            "retrievable": true,
            "sortable": false,
            "facetable": false,
            "key": true,
            "analyzer": null
        },
        {
            "name": "product_type",
            "type": "Edm.String",
            "searchable": true,
            "filterable": true,
            "retrievable": true,
            "sortable": true,
            "facetable": true,
            "key": false,
            "analyzer": null
        },
        {
            "name": "title",
            "type": "Edm.String",
            "searchable": true,
            "filterable": true,
            "retrievable": true,
            "sortable": true,
            "facetable": false,
            "key": false,
            "analyzer": null
        },
        {
            "name": "tag1",
            "type": "Edm.String",
            "searchable": true,
            "filterable": true,
            "retrievable": true,
            "sortable": false,
            "facetable": true,
            "key": false,
            "analyzer": null
        },
        {
            "name": "tag2",
            "type": "Edm.String",
            "searchable": true,
            "filterable": true,
            "retrievable": true,
            "sortable": false,
            "facetable": true,
            "key": false,
            "analyzer": null
        },
        {
            "name": "tag3",
            "type": "Edm.String",
            "searchable": true,
            "filterable": true,
            "retrievable": true,
            "sortable": false,
            "facetable": true,
            "key": false,
            "analyzer": null
        },
        {
            "name": "tag4",
            "type": "Edm.String",
            "searchable": true,
            "filterable": true,
            "retrievable": true,
            "sortable": false,
            "facetable": true,
            "key": false,
            "analyzer": null
        },
        {
            "name": "tag5",
            "type": "Edm.String",
            "searchable": true,
            "filterable": true,
            "retrievable": true,
            "sortable": false,
            "facetable": true,
            "key": false,
            "analyzer": null
        },                                
        {
            "name": "vendor",
            "type": "Edm.String",
            "searchable": true,
            "filterable": true,
            "retrievable": true,
            "sortable": false,
            "facetable": true,
            "key": false,
            "analyzer": null
        },
        {
            "name": "body_html",
            "type": "Edm.String",
            "searchable": true,
            "filterable": true,
            "retrievable": true,
            "sortable": false,
            "facetable": false,
            "key": false,
            "analyzer": null
        }    
    ],
    "scoringProfiles": [],
    "defaultScoringProfile": null,
    "corsOptions": 
    {
    	"allowedOrigins":["*"],
    	"maxAgeInSeconds":300
    },
    "suggesters": [
        {
            "name": "namesuggestor",
            "searchMode": "analyzingInfixMatching",
            "sourceFields": ["title", "vendor", "tag1", "tag2", "tag3","tag4","tag5"]
        }
    ]
};

module.exports = payloads;