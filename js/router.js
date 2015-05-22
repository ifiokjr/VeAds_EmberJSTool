/**
*
* ROUTING
*/
App.Router.map(function() {

  this.resource('application',function(){

    this.resource('about');
    this.resource('pages', function(){

      this.route('index');
      this.resource('page', {path: ':page_id'});
    });
    this.resource('elements', function(){

      this.route('index');
      this.resource('element', {path: ':element_id'});
    });
    this.resource('config');
    });

});

/**
*
* We add a route for the Page model to the page objects in the view
*/
App.PagesRoute = Ember.Route.extend({
  model: function() {

    return this.store.find('Page');
  }
});

App.ElementsRoute = Ember.Route.extend({
  model: function() {

    return this.store.find('Element');
  }
});
