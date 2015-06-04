/**
*
* ROUTING
*/
App.Router.map(function() {
/*To display a model, the route needs to finish in a this.route()
Example: Page
THIS.RESOURCE -> Handle the action on the Route, as can't instanciate a controller.
THIS.ROUTE -> Handle the actions both Route/Controller
*/
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
    this.resource('pixels', function(){

      this.route('index');
      this.resource('pixel', {path: ':pixel_id'});
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
  },
  actions: {    
    deletePage: function(page) {

      if(confirm('Are you sure you want to delete this Page?')){

        //Removing the pages from the related elements
        for(var i = 0; i < App.Element.FIXTURES.length; i++){

          if(App.Element.FIXTURES[i].pages.indexOf(page.id) >= 0){

            App.Element.FIXTURES[i].pages.splice(App.Element.FIXTURES[i].pages.indexOf(page.id),1);

            if(App.Element.FIXTURES[i].pages.length === 0){

              App.Element.FIXTURES.splice(i,1);   
            }         
          }
        }

        page.deleteRecord();
        page.save();
        this.transitionTo('pages.index');
      }
    }
  }
});

App.ElementsRoute = Ember.Route.extend({
  model: function() {

    return this.store.find('Element');
  },
  actions: {    
    deleteElement: function(element) {

      if(confirm('Are you sure you want to delete this Element?')){

      //Removing the element iDs from the pages.
        for(var i = 0; i < App.Page.FIXTURES.length; i++){

          if(App.Page.FIXTURES[i].elements.indexOf(element.id) >= 0){

            App.Page.FIXTURES[i].elements.splice(App.Page.FIXTURES[i].elements.indexOf(element.id),1);     
          }
        }

        element.deleteRecord();
        element.save();
        this.transitionTo('elements.index');
      }
    }
  }
});

App.PixelsRoute = Ember.Route.extend({
  model: function() {

    return this.store.find('Pixel');
  },
  actions: {    
    deletePixel: function(pixel) {

      if(confirm('Are you sure you want to delete this Pixel?')){

        pixel.deleteRecord();
        pixel.save();
        this.transitionTo('pixels.index');
      }
    }
  }
});

