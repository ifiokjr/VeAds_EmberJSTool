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
* Definition of an own type
*/


DS.ArrayTransform = DS.Transform.extend({
  deserialize: function(serialized) {
    return (Ember.typeOf(serialized) == "array")
        ? serialized 
        : [];
  },

  serialize: function(deserialized) {
    var type = Ember.typeOf(deserialized);
    if (type == 'array') {
        return deserialized
    } else if (type == 'string') {
        return deserialized.split(',').map(function(item) {
            return jQuery.trim(item);
        });
    } else {
        return [];
    }
  }
});

App.register("transform:array", DS.ArrayTransform);

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
				address: url,
				elements: ['Elements not selected']
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

/**
* Handles the view object
*/
App.ElementsIndexView = Ember.View.extend({
  didInsertElement : function(){//Function executed after the object is inserted on the template

    this._super();

    	var pList = "";

		for(var i = 0; i < App.Page.FIXTURES.length; i++){

			$('.multiSelect ul').append("<li><input type='checkbox' value='"+App.Page.FIXTURES[i].id+"' /> Name: <span>"+App.Page.FIXTURES[i].name+"</span> ID:<span>"+App.Page.FIXTURES[i].id+"</span></li>");
		}

		$('.multiSel').click(function(){
			$(".dropdown dd ul").slideToggle('fast');
		});

		$('input[type=checkbox]').click(function(){

			$('.checkedSelected').text($('input[type=checkbox]:checked').length);
		})
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
	actions: {
		createElement: function() {

		  // Get the page name by the newPage field
			var name = this.get('newEName');
			var selector = this.get('newESelector');

		  	if (!name.trim() || !selector.trim()) { return; }

			var pages = [];

			$('input[type=checkbox]:checked').each(function(i, selected){ 
				pages[i] = $(selected).val(); 
			});

		  // Create the new Element model
		  	var element = this.store.createRecord('Element', {

		    	id: parseInt(App.Element.FIXTURES[App.Element.FIXTURES.length-1].id)+1,

			    name: name,
				selector: selector,
				pages: pages
		  	});

		  	/*Double binding the elements/pages through the IDs*/
		  	for(var i = 0; i < pages.length; i++){
				for(var ii = 0; ii < App.Page.FIXTURES.length; ii++){

					if(pages[i] == App.Page.FIXTURES[ii].id){

						App.Page.FIXTURES[ii].elements.push(element.id);
					}
				}
			}

		  	/*Clearing the fields.*/
			this.set('newEName', '');
			this.set('newESelector', '');
			$('input[type=checkbox]:checked').attr('checked', false);
			$('.checkedSelected').text(0);
			$('.dropdown dd ul').hide('fast');

			element.save();
		}
	}
});