var suggestUrl = "https://mgsearchdemo.search.windows.net/indexes/shopify-sample/docs/suggest?api-version=2015-02-28&fuzzy=true&suggesterName=namesuggestor&highlightPreTag=<strong>&highlightPostTag=</strong>&$select=id,title,vendor,handle&$top=10&search=";
var searchUrl = "https://mgsearchdemo.search.windows.net/indexes/shopify-sample/docs?api-version=2015-02-28"
var apiQueryKey = "FCF3406A6A4C9FE96B3E7197D370F05F";
var storeUrl = "https://buckridge-hyatt6895.myshopify.com";

$(function () {
  var ProductSearch = function(config) {
    // constructor 
    // ----------- 
    config = config || {};

    this.source = "";
    this.template = null;

    this.search = {
      pageSize: 10,
      query: "",
      facetValue: "",
      facetField: "tag1",
      currentPage: 0,
      orderByField: "",
      orderBySort: ""
    };

    this.config = {
      facet: config["facet"] ,
      searchUrl: config["searchUrl"],
      apiKey: config["apiKey"],
      resultTemplateSource: "#search-result-template",
      navigationTemplateSource: "#search-navigation-template"
    };  
  };

  ProductSearch.prototype = {
    // instance methods 
    // ----------------     
    initialize: function initialize(config) {
      var that = this;
      this.searchResultTemplate = Handlebars.compile($(this.config.resultTemplateSource).html());
      this.searchNavigationTemplate = Handlebars.compile($(this.config.navigationTemplateSource).html());
    
      Handlebars.registerHelper('isActiveFacet', function(options) {
        if( this.value == that.search.facetValue )
        {
          return options.fn(this);
        }
      });
    },

    _selectFacet: function _selectFacet(value) {
      $("#search-result-nav ul li.active").removeClass("active");
      $("#search-result-nav ul li[data-facetvalue='" + value + "']").addClass("active");
      
      this.search.currentPage = 0;

      this.searchProducts(this.search.query, value, false);
    },

    _updateSearchResults: function _updateSearchResults(result, updateNavigation) {
      var that = this;

      if(updateNavigation == true) {
        $("#search-result-nav").html(this.searchNavigationTemplate(result));
        $("#search-result-nav ul li a").click(function(item) {
            var facetValue = item.currentTarget.parentElement.dataset.facetvalue;
            that._selectFacet(facetValue);
        });
        $("#orderBy").change(function(item){
            var option = $(this).find("option:selected");
            var field = option.val();
            var sort = option.data('sort');

            that.setOrderBy(field, sort);
        });
      } 

      $("#search-result-products").html(this.searchResultTemplate(result));

      this._buildPagination(result); 
    },

    _buildFilter: function _buildFilter() {
      if( this.search.facetValue == "" || this.search.facetValue == "All" ) {
        return "";
      }

      return "&$filter=" + encodeURIComponent(this.search.facetField) + " eq '" + encodeURIComponent(this.search.facetValue) + "'";
    },

    _buildOrderBy: function _buildOrderBy() {
      if( this.search.orderByField == "" || this.search.orderByField == "score" ) {
        return "";
      }

      return "&$orderby=" + encodeURIComponent(this.search.orderByField) + " " + this.search.orderBySort;
    },

    _setPage: function _setPage(page) {
      this.search.currentPage = parseInt(page);
      this.searchProducts(this.search.query, this.search.facetValue, false);
    },

    _buildPagination: function _buildPagination(result) {
      var that = this;

      var container = $("#search-result-pager");

      var count = result["@odata.count"];
      var pageSize = this.search.pageSize;
      var pages = Math.floor(count / pageSize);
      var currentPage = this.search.currentPage;

      if (pages == 0) {
        container.html("");
        return;
      }

      var maxPagesToShow = 5;

      var html = "<nav><ul class='pagination'>";

      var appendPage = function(pageNumber) {
          html += " <li class='" + (pageNumber == currentPage ? "active" : "") + "'><a href='#' data-page='" + pageNumber + "'>" + (pageNumber + 1) + "</a></li>";
      };

      if ( pages > 1 ) {
        html += '<li class="' + (currentPage == 0 ? "disabled" : "") + '"><a href="#" data-page="' + (currentPage-1) + '" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>';
      }

      appendPage(0);

      if (currentPage > 1) {
        html += " <li><a href='#' class='disabled'>...</a></li>";
        if ( currentPage === pages && pages > 3) {
          appendPage(currentPage - 2);
        }
        
        appendPage(currentPage - 1);
      }
      
      if (currentPage !== 0 && currentPage !== pages) {
          appendPage(currentPage);
      }
            
      if (currentPage < pages - 1) {
        appendPage(currentPage + 1);
        if(currentPage === 1 && pages > 3) {
            appendPage(currentPage + 2);          
        }
        html += " <li><a href='#' class='disabled'>...</a></li>";
      }

      appendPage(pages);
      
      if (pages > 1) {
        var next = currentPage + 1;
        if (next > pages) {
          next = pages;
        }
        html += '<li class="' + (next == pages ? "disabled" : "") + '"><a href="#" data-page="' + next + '" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>';
      }

      html += "</ul></nav>"

      container.html(html);
      $("a", container).click(function(item) {
        that._setPage(item.currentTarget.dataset.page);
      });
    },
    setOrderBy: function setOrderBy(field, sort) {
      this.search.orderByField = field;
      this.search.orderBySort = sort;

      this.searchProducts(this.search.query, this.search.facetValue, false);
    },

    searchProducts: function searchProducts(query, facetValue, updateNavigation) {
      var that = this;

      if(updateNavigation === null || updateNavigation === undefined) {
        updateNavigation = true;
      }

      query = query.trim();

      this.search.query = query;
      this.search.facetValue = facetValue;

      console.log("Searching for '" + query + "'");
      
      var searchRequest = this.config.searchUrl + 
        "&facet=" + encodeURIComponent(this.search.facetField) +
        "&search=" + encodeURIComponent(query) +
        this._buildFilter() + 
        this._buildOrderBy() +
        "&$top=" + this.search.pageSize +
        "&$count=true" + 
        "&$skip=" + (this.search.currentPage * this.search.pageSize)
      
      console.log("Search: " + searchRequest);

      var searchRequest = $.ajax({
        url: searchRequest,
        headers: {
          "api-key": this.config.apiKey,
          "Content-Type": "application/json"
        }   
      }).done(function(result) {
        // Add metadata for Handlebars
        result["query"] = that.currentQuery;
        result["facetValue"] = that.search.facetValue;

        // Handlebars cannot find to complex id's like @odata.count or @search.facets.facet so copy them to bindable names
        result["count"] = result["@odata.count"];
        result["categories"] = result["@search.facets"][that.search.facetField]
        
        // insert a "All" category
        result["categories"].splice(0,0, {
          value: "All",
          count: result["count"]
        });

        that._updateSearchResults(result, updateNavigation);
      });       
    }
  };

  var productSuggest = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
      remote: {
        url: suggestUrl,
        prepare: function(query, settings){
          settings["url"] = settings["url"] + query;
          settings["headers"] = { 
            "api-key": apiQueryKey
          };
          return settings;
        },
        filter: function(response){
          var results = [];
          response.value.forEach(function(item) {
            results.push({
              id: item["id"],
              result: item["@search.text"],
              title: item["title"],
              vendor: item["vendor"],
              handle: item["handle"]
            });
          });

          // Add a dummy result as Typeahead has a bug with 5 items
          //results.push({});
          
          return results;
      }
      }
  });

  var productSearch = new ProductSearch({
    searchUrl: searchUrl,
    apiKey: apiQueryKey
  });

  productSearch.initialize();

  productSuggest.initialize();

  var searchboxTypeAhead = $('#search .typeahead').typeahead(null, {
    name: 'best-products',
    source: productSuggest.ttAdapter(),
    display: function(item){
      return item.title;
        },
        templates: {
          suggestion: Handlebars.compile('<div>{{{result}}}</div>')
        }
    }).on('typeahead:selected', function (obj, datum) {
      //productSearch(datum);
    });

    // Submit Button
  $("#btnSearch").click(function(){
    productSearch.searchProducts(searchboxTypeAhead.val(), productSearch.search.facetValue);
  });

  // Enter Button
  $('#search .typeahead').keyup(function(event){
      if(event.keyCode == 13){
          $("#btnSearch").click();
      }
  });
});