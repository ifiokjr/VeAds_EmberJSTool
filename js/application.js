App = Ember.Application.create();

/**
*
* Extending the fixture adapting to be able to use the data flux in our app
*/
App.ApplicationAdapter = DS.FixtureAdapter.extend();


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
* Controller associated to the default template. "Static" way of binding values.
*/
App.ApplicationController = Ember.Controller.extend({

 	author: "Ve_TechTeam. JS"
});

App.IndexController = Ember.Controller.extend({

  appName: "VeAds",
  companyName: "VeInteractive"
});

App.ConfigView = Ember.View.extend({

	flexID: '',
 	GenieJC : '',
	ConversionID : '',
	SegProdPage : '',
	SegCompPage : '',
	SegROSPage : ''
});

App.ConfigView = Ember.View.extend({
  didInsertElement : function(){//Function executed after the object is inserted on the template

  	console.log('afterinsertelement');
    this._super();
  }
});

App.ConfigController = Ember.ArrayController.extend({
	pages: function(){

		var array = [];
		var page = {};
	 	
		/*ENCAPSULATE ON A FUNCTION FOR THE PROBLEM OF THE VARIABLES*/
	 	for(var j = 0; j<App.Page.FIXTURES.length; j++){

	 		page.id = App.Page.FIXTURES[j].id;
	 		page.name = App.Page.FIXTURES[j].name;
	 		page.pageType = App.Page.FIXTURES[j].pageType;
	 		page.address = App.Page.FIXTURES[j].address;
	 		page.elements = App.Page.FIXTURES[j].elements;

	 		array.push(page);
	 		page = {};
		}

		return array;

	}.property('pages'),
	elements: function(){

		var array = [];
		var element = {};
	 	for(var z = 0; z<App.Element.FIXTURES.length; z++){

	 		element.id = App.Element.FIXTURES[z].id;
	 		element.name = App.Element.FIXTURES[z].name;
	 		element.selector = App.Element.FIXTURES[z].selector;
	 		element.pages = App.Element.FIXTURES[z].pages;

	 		array.push(element);
	 		element = {};
		}

		return array;
	}.property('elements')
	
});


App.PagesIndexController = Ember.ArrayController.extend({

	newPkey : '',
	newPvalue : '',
	pageTypeElements : ['product','basket','home','landing','login_reg','confirmation','customPage'],
	actions: {
		insertPage: function() {

			var name = $('#newPName').val();
			var type = $('#newTypeElements select option:selected').val();

			var ad = [];

			$('.tab-pane:not(:first)').each(function(){

				ad.push({url:$('#'+$(this).attr('id')+' .addressUrl').text(),params:$('#'+$(this).attr('id')+' .addressParams').text()});
			});

			console.log(name);
			console.log(type);

			/*if (name === undefined || type === undefined || ad.length == 0) { 

		  		displayAlert('pages-index','Fill up all the fields please...','danger');
		  		return; 
		  	}*/


			var page = this.store.createRecord('Page', {

				id: parseInt(App.Page.FIXTURES[App.Page.FIXTURES.length-1].id)+1,
				name: name,
				pageType: type,
				addresses: ad,
				elements: ['Elements not selected']
			});


			// Clear the "newName" text field
			this.set('newPName', '');
			this.set('newPType', '');	
			$('.tab-pane:not(:first)').remove();
			$('.nav-tabs li:not(:first)').remove();	
			$('.alert').alert('close');


			page.save();
			displayAlert('pages-index','This page is created without any elements associated.','warning');
		},
		createAddress : function() {

			var url = this.get('newPUrl');
			var key = this.get('newPkey');
			var value = this.get('newPvalue');

			if (url === undefined || url == '') { 

		  		displayAlert('pages-index','Indicate a Url please...','danger');
		  		return; 
		  	}
		  	else if(!IsURL(url)){


		  		displayAlert('pages-index','Url needs to be a valid url (protocol included)','danger');
		  		return; 
		  	}
		  	else if((key !== "" && value === "") || (value !== "" && key === "")){

		  		displayAlert('pages-index','A parameter needs a key and a value FIRST','danger');
		  		return; 
		  	}

		  	var newDiv = '<div role="tabpanel" class="tab-pane" id="tab'+ $('.tab-pane').length +'">'+

                '<label class="inputLabel" for="newAddres">Url:</label><span class="pageInput addressUrl">'+ url + '</span>'+
                '<label class="inputLabel" for="newAddres">Params:</label><span class="pageInput addressParams">'+ key + '='+ value +'</span>'+
		  	'</div>';

		  	$('.nav-tabs').append('<li role="presentation"><a href="#tab'+ $('.tab-pane').length +'" aria-controls="tab'+ $('.tab-pane').length+'" role="tab" data-toggle="tab">'+$('.tab-pane').length+'</a></li>');
		  	$('.tab-content').append(newDiv);

		  	this.set('newPUrl', '');
			this.set('newPkey', '');
			this.set('newPvalue', '');
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
	actions: {
		createElement: function() {

		  // Get the page name by the newPage field
			var name = this.get('newEName');
			var selector = this.get('newESelector');

		  	if (name === undefined || selector === undefined) { 

		  		displayAlert('element-index','Fill up all the fields please...','danger');
		  		return; 
		  	}

		  	if ($('input[type=checkbox]:checked').length < 1) { 

		  		displayAlert('element-index','Select at least one page where to apply this element please...','danger');
		  		return; 
		  	}

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
			$('.alert').alert('close');

			element.save();
		}
	}
});


/**
* OTHER FUNCTIONS
*/
function displayAlert(element, message, status){

	var messageTitle = '';

	switch(status){

		case 'danger':
			messageTitle = 'Error';
			break;
		case 'warning':
			messageTitle = 'Warning';
			break;
	}

	var alert = '<div class="alert alert-'+ status +' alert-error">'+
                	'<a href="#" class="close" data-dismiss="alert">&times;</a>'+
                	'<strong>'+ messageTitle +'!</strong> <span>'+ message +'</span></div>';

    $('.'+element+' .alert-slot').append(alert);
}

function IsURL(url) {

	var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
	return regexp.test(url);
}


/*setInterval(function(){

	var array = [];
	var page = {};
 	

		//ENCAPSULATE ON A FUNCTION FOR THE PROBLEM OF THE VARIABLES
	 	for(var j = 0; j<App.Page.FIXTURES.length; j++){

	 		(function(App, page, array){
	 	 		page.id = App.Page.FIXTURES[j].id;
		 		page.name = App.Page.FIXTURES[j].name;
		 		page.pageType = App.Page.FIXTURES[j].pageType;
		 		page.address = App.Page.FIXTURES[j].address;
		 		page.elements = App.Page.FIXTURES[j].elements;

		 		array.push(page);
		 		page = {};
			})(App, page, array);
		}
	console.log(array.length);
	App.ConfigController.pages = array;
}, 3000);*/