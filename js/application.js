/**
*
* Creation of the app with our global name
*/
window.VeAds = Ember.Application.create();

/**
*
* Extending the fixture adapting to be able to use the data flux in our app
*/
VeAds.ApplicationAdapter = DS.FixtureAdapter.extend();

/**
*
* Controller associated to the default template 'application'. "Static" way of binding text.
*/
VeAds.ApplicationController = Ember.Controller.extend({

  appName: "VeAds",
  companyName: "VeInteractive"
});
