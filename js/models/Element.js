/**
*
* MODEL
*/
App.Element = DS.Model.extend({
   	name: DS.attr('string'),
	selector: DS.attr('string'),
	pages: DS.attr('array')
});


/**
*
* This is some static content using the FixtureAdapter extended in application.js . Page examples 
*/
App.Element.FIXTURES = [
	{
		id:1,
	    name: 'Product ID',
		selector: '#productName',
		pages: ['0','1']
	},{
		id:2,
	    name: 'Unit Price',
		selector: '.product .price',
		pages: ['1','2']
	},{
		id:3,
	    name: 'Produc image',
		selector: '.product .image',
		pages: ['0','5']
	}];
