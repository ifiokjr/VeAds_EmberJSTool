/**
*
* We define the model. What is a page?
*/
VeAds.Page = DS.Model.extend({
   	name: DS.attr('string'),
	pageType: DS.attr('string'),
	address: DS.attr('string')
});

/**
*
* This is some static content using the FixtureAdapter extended in application.js . Page examples 
*/
VeAds.Page.FIXTURES = [
	{
		id:1,
	    name: 'Product Page',
	    pageType: 'product', 
		address: 'http://dummy.com/example'
	},{
		id:2,
	    name: 'Basket Page',
	    pageType: 'basket', 
		address: 'http://dummy.com/example'
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