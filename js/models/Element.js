/**
*
* MODEL
*/
App.Element = DS.Model.extend({
   	name: DS.attr('string'),
	selector: DS.attr('string')
});

/**
*
* This is some static content using the FixtureAdapter extended in application.js . Page examples 
*/
App.Element.FIXTURES = [
	{
		id:1,
	    name: 'Product ID',
		selector: '#productName'
	},{
		id:2,
	    name: 'Unit Price',
		selector: '.product .price'
	},{
		id:3,
	    name: 'Produc image',
		selector: '.product .image'
	}];
