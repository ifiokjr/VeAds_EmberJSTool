/*******************************
*
* ELEMENT MODEL
* 
* @elementType ['orderId','orderVal','productId','idList','itemString','currency','other']
* @regexInclude include - run the regex through each
* @regexExclude exclude - runs each regex string and strips everything matched
* @captureUseMappings {Boolean} useMappings - can be set to transform values via mappings
* @captureCriteria [contains, equal]
* @captureType [ selector, globalVariable, dataLayer, dataLayerReverse ]
* @captureSelector Selector or name of the global variable.
*******************************/
App.Element = DS.Model.extend({
   	name: DS.attr('string'),
	elementType: DS.attr('string'),
	fallback: DS.attr('string'),
	pages: DS.attr('array'),
	regexInclude: DS.attr('string'),
	regexExclude: DS.attr('string'),
	captureType: DS.attr('string'),
	captureUseMappings: DS.attr('string'),	
	captureCriteria: DS.attr('string'),
	captureSelector: DS.attr('string')
});


/**
*
* This is some static content using the FixtureAdapter extended in application.js . Page examples 
*/
App.Element.FIXTURES = [
	{
		id:1,
	    name: 'Product ID',
	    elementType:'orderVal',
		fallback: '50',
		pages: ['0','1'],
		regexInclude: ';kj;k',
		regexExclude: ''  ,
		captureType: 'selector',
		captureUseMappings: false,	
		captureCriteria: 'contains',
		captureSelector: '#productName'
	},{
		id:2,
	    name: 'Unit Price',
	    elementType:'orderId',
		fallback: '100',
		pages: ['1','2'],
		regexInclude: ';kj;k',
		regexExclude: ''  ,
		captureType: 'selector',
		captureUseMappings: false,	
		captureCriteria: 'equals',
		captureSelector: '#productName'
	},{
		id:3,
	    name: 'Produc image',
	    elementType:'productId',
		fallback: '10',
		pages: ['0','5'],
		regexInclude: ';kj;k',
		regexExclude: ''  ,
		captureType: 'selector',
		captureUseMappings: false,	
		captureCriteria: 'contains',
		captureSelector: '#productName'
	}];