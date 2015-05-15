App = Ember.Application.create();

/**
*
* Extending the fixture adapting to be able to use the data flux in our app
*/
App.ApplicationAdapter = DS.FixtureAdapter.extend();

/**
*
* Controller associated to the default template. "Static" way of binding values.
*/
App.ApplicationController = Ember.Controller.extend({

 	author: "Jose Sentis",
 	flexID : '',
 	GenieJC : '',
	ConversionID : '',
	SegProdPage : '',
	SegCompPage : '',
	SegROSPage : ''
});


App.IndexController = Ember.Controller.extend({

  appName: "VeAds",
  companyName: "VeInteractive"
});
