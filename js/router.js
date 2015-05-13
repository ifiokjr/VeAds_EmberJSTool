/**
*
* Creates the routes to link the different pages.
*/
VeAds.Router.map(function() {

	this.resource('application');//These routes have the template in the index, so the route has to be the root.
	this.resource('Page');
 /* this.resource('Pages', function() {
    this.resource('page', { path: ':page_id' });
  });*/
	this.resource('elements');
	this.resource('about');
});

/**
*
* We add a route for the Page model to the page objects in the view
*/
VeAds.PageRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('Page');//This is the name of the data-template-name
  }
});

/*App.PageRoute = Ember.Route.extend({
  model: function(params) {
    return Pages.findBy('id', params.page_id);
  }
});*/
/*
When we want the Index to redirect somewhere
VeAds.IndexRoute = Ember.Route.extend({
  redirect: function() {
    this.transitionTo('about');
  }
});*/