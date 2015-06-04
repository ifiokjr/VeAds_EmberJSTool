/*******************************
*
* PAGE MODEL
* 
* @pageType ['product','basket','home','landing','login_reg','confirmation','customPage']
* @addresses  - array of address objects with url + params || url
* @elements - array of element IDs applied to this page
*******************************/
App.Page = DS.Model.extend({
   	name: DS.attr('string'),
	pageType: DS.attr('string'),
	addresses: DS.attr('array'),
	elements: DS.attr('array')
});


App.Page.FIXTURES = [
	{
		id:1,
	    name: 'Product Page',
	    pageType: 'product', 
		addresses: [
			{url:'http://dummy.com/example',params:'session=123'},
			{url:'http://dummy.com/example',params:'session=123'},
			{url:'awesome.com/checkout/complete/'}],
		elements: ['1','8'],
		dynamicIdentifiers: [
        {
          selector: '#progress',
          criteria: 'contains',
          values: ['Complete Page', 'Página Completa']
        },
        {
          selector: '#awesome',
          criteria: 'contains',
          values: ['Yo']
        }
      ]
	},{
		id:5,
	    name: 'Product Page',
	    pageType: 'product', 
		addresses: [{url:'http://dummy.com/example',params:'session=123'}],
		elements: ['0','8'],
		dynamicIdentifiers: []
	},{
		id:2,
	    name: 'Basket Page',
	    pageType: 'basket', 
		addresses: [{url:'http://merdo.com/example', params:'session=456'}],
		elements: ['6'],
		dynamicIdentifiers: [
        {
          selector: '#progress',
          criteria: 'contains',
          values: ['Complete Page', 'Página Completa']
        },
        {
          selector: '#awesome',
          criteria: 'contains',
          values: ['Yo']
        }
      ]
	}];
