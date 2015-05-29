App = Ember.Application.create({

	LOG_TRANSITIONS: true
});

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
* VIEWS & CONTROLLERS.
*/
App.ApplicationController = Ember.Controller.extend({

 	author: "Ve_TechTeam. JS"
});

App.IndexController = Ember.Controller.extend({

  appName: "VeAds",
  companyName: "VeInteractive"
});


/**
* ELEMENTS INDEX. We need controller to execute create Page and address.
*/
App.PagesIndexController = Ember.Controller.extend({

	pageTypeElements : ['product','basket','home','landing','login_reg','confirmation','customPage'],
	actions: {		
			createPage: function() {

			var name = $('#newPName').val();
			var type = $('#newTypeElements select option:selected').val();

			var ad = [];

			$('.tab-pane:not(:first)').each(function(){

				ad.push({url:$('#'+$(this).attr('id')+' .addressUrl').text(),params:$('#'+$(this).attr('id')+' .addressParams').text()});
			});

			/*if (name === undefined || type === undefined || ad.length == 0) { 

		  		displayAlert('pages-index','Fill up all the fields please...','danger');
		  		return; 
		  	}*/

			var page = this.store.createRecord('Page', {

				id: nextID(App.Page.FIXTURES),
				// id: parseInt(App.Page.FIXTURES[App.Page.FIXTURES.length-1].id)+1,
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

			this.newInserted = true;

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
		  	/*else if(!IsURL(url)){


		  		displayAlert('pages-index','Url needs to be a valid url (protocol included)','danger');
		  		return; 
		  	}*/
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


App.PageController = Ember.ObjectController.extend({

	isEditing: false,
	actions:{
		edit: function(){

			this.set('isEditing', true);
		},
		doneEditing: function(){

			this.set('isEditing', false);
		},
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
				this.transitionToRoute('pages.index');
			}
	    }
	}
});


/**
* ELEMENTS INDEX. We need view, to execute actions when view inserted.
*  				  We need controller to execute create Element.
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

App.ElementsIndexController = Ember.Controller.extend({

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

		    	id: nextID(App.Element.FIXTURES),
		    	// id: parseInt(App.Element.FIXTURES[App.Element.FIXTURES.length-1].id)+1,
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

App.ElementController = Ember.ObjectController.extend({

	isEditing: false,
	actions:{
		edit: function(){

			this.set('isEditing', true);
		},
		doneEditing: function(){

			this.set('isEditing', false);

			var newPages = this.get('pages');
			var elemID = this.get('id');

			var index;

			for(var i = 0; i < App.Page.FIXTURES.length; i++){

				index = newPages.indexOf(App.Page.FIXTURES[i].id);

				if(index > -1){//We push this element to the pages don't have it and need it
					if(App.Page.FIXTURES[i].elements.indexOf(elemID) == -1){

						App.Page.FIXTURES[i].elements.push(elemID);
					}
				}else{//We remove it from the pages have it and don't need it
					if(App.Page.FIXTURES[i].elements.indexOf(elemID) > -1){

						App.Page.FIXTURES[i].elements.splice(App.Page.FIXTURES[i].elements.indexOf(elemID),1);
					}
				}
			}
		},
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
		        this.transitionToRoute('elements.index');
		    }
		}
	}
});

/*
* CONFIG. Just displaying, we need view but no controller.
*/
App.ConfigView = Ember.View.extend({

	flexID: '',
	GenieJC : '',
	ConversionID : '',
	SegProdPage : '',
	SegCompPage : '',
	SegROSPage : '',
	pages: '',
	elements: '',
	didInsertElement : function(){//Function executed after the object is inserted on the template

		this._super();

		/*** We need to set the pages/elements objects after inserting the view, as properties can be observed from fixtures, but not updated after controller.init() ***/
		var pageArray = [];
		var page = {};	
		var elementArray = [];
		var element = {};
			
			for(var j = 0; j<App.Page.FIXTURES.length; j++){

				page.id = App.Page.FIXTURES[j].id;
				page.name = App.Page.FIXTURES[j].name;
				page.pageType = App.Page.FIXTURES[j].pageType;
				page.address = App.Page.FIXTURES[j].address;
				page.elements = App.Page.FIXTURES[j].elements;

				pageArray.push(page);
				page = {};
		}

			for(var z = 0; z<App.Element.FIXTURES.length; z++){

				element.id = App.Element.FIXTURES[z].id;
				element.name = App.Element.FIXTURES[z].name;
				element.selector = App.Element.FIXTURES[z].selector;
				element.pages = App.Element.FIXTURES[z].pages;

				elementArray.push(element);
				element = {};
		}

		this.pages = formatPages(pageArray);
		this.elements = formatElements(elementArray);
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

function formatPages(pagesArray){

  var formattedArray = 'pages:[<span>';

  for(var i = 0; i<pagesArray.length; i++){

    formattedArray += '<span class="configObject">{id:<span>'+pagesArray[i].id+'</span>,</span>';
    formattedArray += '<span class="configObject">name:<span>'+pagesArray[i].name+'</span>,</span>';
    formattedArray += '<span class="configObject">pageType:<span>'+pagesArray[i].pageType+'</span>,</span>';
    formattedArray += '<span class="configObject">address:<span>'+pagesArray[i].address+'</span>,</span>';
    formattedArray += '<span class="configObject">elements:[<span>'+pagesArray[i].elements+'</span>]}</span>';
    formattedArray += '<span class="configObject configObjectSeparator">,</span>';  
  }

  formattedArray += '</span>],';

  $('.configObject.pages').empty();
  $('.configObject.pages').append(formattedArray);
}

function formatElements(elementsArray){

  var formattedArray = 'elements:[<span>';

  for(var i = 0; i<elementsArray.length; i++){

    formattedArray += '<span class="configObject">{id:<span>'+elementsArray[i].id+'</span>,</span>';
    formattedArray += '<span class="configObject">name:<span>'+elementsArray[i].name+'</span>,</span>';
    formattedArray += '<span class="configObject">selector:<span>'+elementsArray[i].selector+'</span>,</span>';
    formattedArray += '<span class="configObject">pages:[<span>'+elementsArray[i].pages+'</span>]}</span>';
    formattedArray += '<span class="configObject configObjectSeparator">,</span>';  
  }

  formattedArray += '</span>],';

  $('.configObject.elements').empty();
  $('.configObject.elements').append(formattedArray);
}


function nextID(fixtures){

	var maxId = fixtures[0].id;

	for(var i = 0; i < fixtures.length; i++){
		if(fixtures[i].id > maxId){

			maxId = fixtures[i].id;
		}
	}

	maxId++;

	return maxId;
}

/*window.onbeforeunload = function (e) {
	e = e || window.event;

if (e) {
    e.returnValue = "Sure? If you reload you'll lose your data";
}

return "Sure? If you reload you'll lose your data";
};*/