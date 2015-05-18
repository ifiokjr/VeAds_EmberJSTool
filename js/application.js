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

 	author: "Ve_TechTeam. JS",
 	flexID : '',
 	GenieJC : '',
	ConversionID : '',
	SegProdPage : '',
	SegCompPage : '',
	SegROSPage : '',
	pageTypeElements : ['product','basket','home','landing','login_reg','confirmation','customPage'],
	selectedPageType : 'product'
});


App.IndexController = Ember.Controller.extend({

  appName: "VeAds",
  companyName: "VeInteractive"
});


/**
*
* CONTROLLERS.
* IMPORTANT: The page controllers are related to the ROUTING names
*/
App.PagesIndexController = Ember.ArrayController.extend({

	pageTypeElements : ['product','basket','home','landing','login_reg','confirmation','customPage'],
	actions: {
		createPage: function() {
		// Get the page name by the newPage field
			var name = this.get('newPName');
			// var type = this.selectedPageType;
			// var type = this.get('newPType');
			var type = this.get('selectedPageType');
			var url = this.get('newPUrl');

			if (!name.trim() || !type.trim() || !url.trim()) { return; }

			// Create the new Page model
			var page = this.store.createRecord('Page', {

				id: parseInt(App.Page.FIXTURES[App.Page.FIXTURES.length-1].id)+1,
				// id: $('.pageLine').length+1,
				name: name,
				pageType: type,
				address: url
			});

			// Clear the "newName" text field
			this.set('newPName', '');
			this.set('newPType', '');
			this.set('newPUrl', '');

			// Save the new model
			/* Save returns a promise. These are used to handle the exit or failure of the saving.
			[:TODO] - Investigate about this.
			    var self = this;

			    function transitionToPost(post) {
			        self.transitionToRoute('posts.show', post);
			    }

			    function failure(reason) {
			      // handle the error
			    }

			     post.save().then(transitionToPost).catch(failure):
			*/
			page.save();
		}
  	}
});

App.ElementsIndexController = Ember.ArrayController.extend({
	/*currentPages : [], NOT SUPPORTED, BUT LEFT HERE AS AN EXAMPLE OF HOW TO DO IT
	init: function(){

		this._super(); //Necessary if we override init.


		for(var i = 0; i < App.Page.FIXTURES.length; i++){

			this.currentPages.push({id:App.Page.FIXTURES[i].id,name:App.Page.FIXTURES[i].name});
		}
	},*/
	init: function(){

		this._super(); //Necessary if we override init.

		var pList = "";

		for(var i = 0; i < App.Page.FIXTURES.length; i++){

			pList += "<li><input type='checkbox' value='"+App.Page.FIXTURES[i].id+"' /><span>"+App.Page.FIXTURES[i].id+"</span><span>"+App.Page.FIXTURES[i].name+"</span></li>";
			console.log(pList);
		}
		$('.mutliSelect ul').append("<li><input type='checkbox' value='1' /><span>1</span><span>Product Page</span></li><li><input type='checkbox' value='2' /><span>2</span><span>Basket Page</span></li>");
		$('.mutliSelect ul').append(pList);
	},
	actions: {
		createElement: function() {
		  // Get the page name by the newPage field
		  var name = this.get('newEName');
		  var selector = this.get('newESelector');

		  if (!name.trim() || !selector.trim()) { return; }

		  // Create the new Element model
		  var element = this.store.createRecord('Element', {

		    id: parseInt(App.Element.FIXTURES[App.Element.FIXTURES.length-1].id)+1,

		    name: name,
			selector: selector
		  });

		  // Clear the "newName" text field
		  this.set('newEName', '');
		  this.set('newESelector', '');

		  element.save();
		}
	}
});