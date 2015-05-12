var App = Ember.Application.create();

/**
*
* Indicates the app where to store things, and where to get the stored things from.
*/
App.ApplicationStore = DS.Store.extend({
	revision:12,
	adapter: 'DS.FixtureAdapter'
});
/**
*
* Creates the routes to link the different pages.
*/
App.Router.map(function() {
   this.resource('pages');
   this.resource('elements');
  this.resource('about');
});


/**
*
* We define the model. What is a page?
*/
App.Page = DS.Model.extend({
	id: DS.attr('number'),
   	name: DS.attr('string'),
	pageType: DS.attr('string'),
	address: DS.attr('string')
});

/**
*
* This is some static content. Example
*/
App.Page.FIXTURES = [{
  	id: 1,
    name: 'Product Page',
    pageType: 'product', 
	address: "http://dummy.com/example"
}];

/*[:TODO] - THIS ATTS NEED SUBCLASIFICATION!!! 
 /*  
    adresses:{
      address : [{
        url:'http://dummyplace.com/',
        params:[{'session':'mysession'}]
      },{
        url:'http://dummyplace.com/',
        params:[{'session':'mysession'}]       
      }],
      sharedParams = [{}]    
    },
    dataElementIds:[1,2]*/