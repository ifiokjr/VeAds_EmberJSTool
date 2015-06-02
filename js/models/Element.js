/**
*
* MODEL
*/
App.Element = DS.Model.extend({
   	name: DS.attr('string'),
	selector: DS.attr('string'),
	fallback: DS.attr('string'),
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
		fallback: '50',
		pages: ['0','1'],
		regexInclude: ';kj;k',
		regexExclude: ''  
	},{
		id:2,
	    name: 'Unit Price',
		selector: '#productName',
		fallback: '100',
		pages: ['1','2'],
		regexInclude: ';kj;k',
		regexExclude: ''  
	},{
		id:3,
	    name: 'Produc image',
		selector: '#productName',
		fallback: '10',
		pages: ['0','5'],
		regexInclude: ';kj;k',
		regexExclude: ''  
	}];
