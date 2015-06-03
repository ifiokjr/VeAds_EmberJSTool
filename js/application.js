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
* Pages INDEX. We need controller to execute create Page and address.
*/
App.PagesIndexController = Ember.Controller.extend({
	controllerName: 'PagesIndexController',
	pageTypeElements : ['product','basket','home','landing','login_reg','confirmation','customPage'],
	actions: {		
			createPage: function() {

			var name = this.get('newPName');
			var type = $('#newTypePages select option:selected').val();

			var urls = [];

			$('.tab-pane:not(:first)').each(function(){

				if($('#'+$(this).attr('id')+' .addressParams').length > 0){

					urls.push({url:$('#'+$(this).attr('id')+' .addressUrl').text()});
				}else{

					urls.push({url:$('#'+$(this).attr('id')+' .addressUrl').text(),params:$('#'+$(this).attr('id')+' .addressParams').text()});
				}
			});

			/*if (name === undefined || type === undefined || urls.length == 0) { 

		  		displayAlert('pages-index','Fill up all the fields please...','danger');
		  		return; 
		  	}*/

			var page = this.store.createRecord('Page', {

				id: nextID(App.Page.FIXTURES),
				// id: parseInt(App.Page.FIXTURES[App.Page.FIXTURES.length-1].id)+1,
				name: name,
				pageType: type,
				addresses: urls,
				elements: ['Elements not selected']
			});
			appLog(this.controllerName,'REMINDER. elements array is empty.');

			// Clear the "newName" text field
			this.set('newPName', '');
			this.set('newPType', '');	
			$('.tab-pane:not(:first)').remove();
			$('.nav-tabs li:not(:first)').remove();	
			$('.tab-pane').addClass('active');
			$('.nav-tabs li:first').addClass('active');
			$('.alert').alert('close');

			this.newInserted = true;

			page.save();
			displayAlert('pages-index','This page is created without any elements associated.','warning');
		},
		createAddress : function() {

			appLog(this.controllerName,'creating new address.');

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

		  		displayAlert('pages-index','A parameter needs a key and a value','danger');
		  		return; 
		  	}

		  	var newid = 'tab' + $('.tab-pane').length;

		  	var newDiv = '<div role="tabpanel" class="tab-pane" id="'+ newid +'">'+

                '<label class="inputLabel" for="newAddres">Url:</label><span class="pageInput addressUrl" contenteditable="true">'+ url + '</span>' +
                '<span class="delete-button"><img src="img/trash.png" alt="delete" height="18" width="18"></span>';

			if((key !== undefined && key !== '') || (value !== undefined && value !== '')){

				newDiv += '<label class="inputLabel" for="newAddres">Params:</label><span class="pageInput addressParams"><span contenteditable="true">'+ key + '</span>=<span contenteditable="true">'+ value +'</span></span>';
			}		             

            newDiv += '</div>';

		  	$('.nav-tabs').append('<li role="presentation"><a href="#tab'+ $('.tab-pane').length +'" aria-controls="tab'+ $('.tab-pane').length+'" role="tab" data-toggle="tab">'+$('.tab-pane').length+'</a></li>');
		  	$('.tab-content').append(newDiv);

			appLog(this.controllerName,'appending the new address.');

			$('#' + newid + ' .delete-button').click(function(){

			    $('#' + newid).remove();
				$('[aria-controls="'+newid+'"]').parent().remove();
				$('.nav-tabs li').removeClass('active')
				$('.nav-tabs li:first').addClass('active');
				$('.tab-pane').removeClass('active');
				$('.tab-pane:first').addClass('active');
			});

		  	this.set('newPUrl', '');
			this.set('newPkey', '');
			this.set('newPvalue', '');
		}
  	}
});


/*****************
* PAGE CONTROLLER: controller for the display of the created pages view
* 
* edit: sets the edit mode available.
* doneEditing: saves the changes and sets the editing mode off.
* deletePage: deletion of the page, considering the elements applied. If element is empty after page removal, element is removed.
*****************/
App.PageController = Ember.ObjectController.extend({
	controllerName: 'PageController',
	isEditing: false,
	actions:{
		edit: function(){

			this.set('isEditing', true);
		},
		doneEditing: function(element){

			appLog(this.controllerName,'editing the page with id ' + this.get('id'));

			element.set('name', this.get('name'));
			element.set('addresses', this.get('addresses'));

			element.save();
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
	controllerName: 'ElementsIndexView',
	didInsertElement : function(){//Function executed after the object is inserted on the template

		this._super();

		var pList = "";

		for(var i = 0; i < App.Page.FIXTURES.length; i++){

			$('.dropdown .multiSelect ul').append("<li><input type='checkbox' value='"+App.Page.FIXTURES[i].id+"' /> Name: <span>"+App.Page.FIXTURES[i].name+"</span> ID:<span>"+App.Page.FIXTURES[i].id+"</span></li>");
		}

		$('.dropdown .multiSel').click(function(){
			$(".dropdown dd ul").slideToggle('fast');
		});

		$('.dropdown input[type=checkbox]').click(function(){

			$('.checkedSelected').text($('.dropdown input[type=checkbox]:checked').length);
		})
	}
});

App.ElementsIndexController = Ember.Controller.extend({
	controllerName: 'ElementsIndexController',
	dataTypeElements : ['orderId','orderVal','productId','idList','itemString','currency','other'],
	actions: {
		createElement: function() {

		  	appLog(this.controllerName,'element creation');
			var name = this.get('newEName');
			var type = $('#newTypeElements select option:selected').val();
			var fallback = this.get('newEfallback');
			var regexInclude = this.get('newEregexInclude');
			var regexExclude = this.get('newEregexExclude');
			var captureSelector = this.get('newESelector');
			var captureCriteria = $('#newECriteria [name="newECriteria"]:checked').val();
			var captureUseMappings = this.get('newEFormMappigns');
			var captureType = $('#newEType [name="newEType"]:checked').val();


		  	if (name === undefined || captureSelector === undefined) { 

		  		displayAlert('element-index','Fill up all the fields please...','danger');
		  		return; 
		  	}

		  	if ($('input[type=checkbox]:checked').length < 1) { 

		  		displayAlert('element-index','Select at least one page where to apply this element please...','danger');
		  		return; 
		  	}

			var pages = [];

			$('.dropdown input[type=checkbox]:checked').each(function(i, selected){ 
				pages[i] = $(selected).val(); 
			});

		  // Create the new Element model
		  	var element = this.store.createRecord('Element', {

		    	id: nextID(App.Element.FIXTURES),
			    name: name,
			    elementType: type,
				fallback: fallback,
				regexInclude: regexInclude,
			    regexExclude: regexExclude,
				pages: pages,
				captureSelector: captureSelector,
				captureCriteria: captureCriteria,
				captureUseMappings: captureUseMappings,
				captureType: captureType
		  	});

		  	/*Double binding the elements/pages through the IDs*/
		  	for(var i = 0; i < pages.length; i++){
				for(var ii = 0; ii < App.Page.FIXTURES.length; ii++){

					if(pages[i] == App.Page.FIXTURES[ii].id){
		  				
		  				appLog(this.controllerName,'double binding element with page id:' + App.Page.FIXTURES[ii].id);
						App.Page.FIXTURES[ii].elements.push(element.id);
					}
				}
			}

		  	/*Clearing the fields.*/
			this.set('newEName', '');
			this.set('newESelector', '');
			this.set('newEregexExclude', '');
			this.set('newEregexInclude', '');
			this.set('newEfallback', '');
			$('.dropdown input[type=checkbox]:checked').attr('checked', false);
			$('.checkedSelected').text(0);
			$('.dropdown dd ul').hide('fast');
			$('.alert').alert('close');

			element.save();
		}
	}
});

App.ElementController = Ember.ObjectController.extend({
	controllerName: 'ElementController',
	isEditing: false,
	actions:{
		edit: function(element){

			this.set('isEditing', true);
			this.set('tempPages', this.get('pages'));
		},
		/*If element doesn't apply to any page after editing, it will be removed.*/
		doneEditing: function(element){

			var newPages = this.get('pages');
			var elemID = this.get('id');

			var index;

			//Editing and saving the element.
			appLog(this.controllerName,'saving the element with id ' + elemID);

			if(newPages.length < 1){

				if(confirm('Not applying the element to any pages. Element will be removed...')){

					if(!this.send('deleteElement', element)){

						appLog(this.controllerName,'setting back the pages to the original');
						this.set('pages', this.get('tempPages'));
					}
				}else{

					appLog(this.controllerName,'setting back the pages to the original');
					this.set('pages', this.get('tempPages'));
				}
			}else{

				element.set('name',this.get('name'));
				element.set('selector', this.get('selector'));
				element.set('pages', newPages);
				element.set('fallback', this.get('fallback'));
				element.set('regexInclude', this.get('regexInclude'));
				element.set('regexExclude', this.get('regexExclude'));
				element.set('captureType', this.get('captureType'));
				element.set('captureUseMappings', this.get('captureUseMappings'));
				element.set('captureCriteria', this.get('captureCriteria'));
				element.set('captureSelector', this.get('captureSelector'));

				//Editing the pages related to the element
				for(var i = 0; i < App.Page.FIXTURES.length; i++){

					index = newPages.indexOf(App.Page.FIXTURES[i].id);

					if(index > -1){//We push this element to the pages don't have it and need it
						if(App.Page.FIXTURES[i].elements.indexOf(elemID) == -1){

							appLog(this.controllerName,'pushing element id to page ' + App.Page.FIXTURES[i].id);
							App.Page.FIXTURES[i].elements.push(elemID);
						}
					}else{//We remove it from the pages have it and don't need it
						if(App.Page.FIXTURES[i].elements.indexOf(elemID) > -1){

							appLog(this.controllerName,'removing element id from ' + App.Page.FIXTURES[i].id);
							App.Page.FIXTURES[i].elements.splice(App.Page.FIXTURES[i].elements.indexOf(elemID),1);
						}
					}
				}
				element.save();
				this.set('isEditing', false);
				this.set('tempPages', '');
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
		    }else{

		    	return false;
		    }
		}
	}
});

/*
* CONFIG. Just displaying, we need view but no controller.
*
* @timeStamp - A random alphanumeric string of characters, used to namespace storage. Can be changed in order to clear all stored elements for future updates
*/
App.ConfigView = Ember.View.extend({
	controllerName: 'ConfigView',
	timeStamp: '',
	uuid: '',
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
		appLog(this.controllerName,'Rendering config element');

		/*** We need to set the pages/elements objects after inserting the view, as properties can be observed from fixtures, but not updated after controller.init() ***/
		var pageArray = [];
		var page = {};	
		var elementArray = [];
		var element = {};
		var regex = {};
			
			for(var j = 0; j<App.Page.FIXTURES.length; j++){

				page.id = App.Page.FIXTURES[j].id;
				page.name = App.Page.FIXTURES[j].name;
				page.pageType = App.Page.FIXTURES[j].pageType;
				page.addresses = App.Page.FIXTURES[j].addresses;
				page.elements = App.Page.FIXTURES[j].elements;
				//page.dynamicIdentifiers = App.Page.FIXTURES[j].dynamicIdentifiers;

				pageArray.push(page);
				page = {};
		}

			for(var z = 0; z<App.Element.FIXTURES.length; z++){

				element.id = App.Element.FIXTURES[z].id;
				element.name = App.Element.FIXTURES[z].name;
				element.elementType = App.Element.FIXTURES[z].elementType;
				element.captureType = App.Element.FIXTURES[z].captureType;
				element.captureUseMappings = App.Element.FIXTURES[z].captureUseMappings;
				element.captureCriteria = App.Element.FIXTURES[z].captureCriteria;
				element.captureSelector = App.Element.FIXTURES[z].captureSelector;
				element.fallback = App.Element.FIXTURES[z].fallback;
				element.pages = App.Element.FIXTURES[z].pages;

				regex.include = App.Element.FIXTURES[z].regexInclude;
				regex.exclude = App.Element.FIXTURES[z].regexExclude;

				element.regex = regex;

				elementArray.push(element);
				element = {};
				regex = {};
		}

		this.pages = formatPages(pageArray);
		this.elements = formatElements(elementArray);
	}
});

App.ConfigController = Ember.ObjectController.extend({
	controllerName: 'ConfigController',
	version: '2.0.0',
	/*
    * Rather than inserting img pixels into the DOM it's possible to generate
    *the same request using JavaScript. This is much more performant.
    */
    avoidDOM: 'false',
	init: function(){

		this._super();

		appLog(this.controllerName, 'Initializing controller');
		this.set('timeStamp', new Date());

		this.set('uuid',Math.random().toString(36).slice(2));
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

    console.log(messageTitle + ': ' + element + ' -> ' + message);
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
    formattedArray += '<span class="configObject">name:<span>"'+pagesArray[i].name+'"</span>,</span>';
    formattedArray += '<span class="configObject">type:<span>"'+pagesArray[i].pageType+'"</span>,</span>';
    formattedArray += '<span class="configObject">'+formatAddresses(pagesArray[i].addresses)+'</span>';
    formattedArray += '<span class="configObject">elements:[<span>'+pagesArray[i].elements+'</span>],</span>';
    //formattedArray += '<span class="configObject">'+formatDynamicId(pagesArray[i].dynamicIdentifiers)+'}</span>';
    formattedArray += '<span class="configObject configObjectSeparator">,</span>';  
  }

  formattedArray += '</span>],';

  $('.configObject.pages').empty();
  $('.configObject.pages').append(formattedArray);
}

function formatAddresses(addressesArray){

	var formattedArray = 'urls:[<span>';

	for(var i = 0; i<addressesArray.length; i++){

		if(addressesArray[i].hasOwnProperty('params')){

			formattedArray += '<span class="configObject">{url:<span>"'+addressesArray[i].url+'"</span>,</span>';
			formattedArray += '<span class="configObject">params:{'; 
			formattedArray += '<span class="configObject">'+ addressesArray[i].params.slice(0, addressesArray[i].params.indexOf('=')) +':<span>"'+addressesArray[i].params+'"</span>}</span>'; 
			formattedArray += '}</span>'; 
		}else{

			formattedArray += '<span class="configObject"><span>"'+addressesArray[i].url+'"</span></span>';
		}
		formattedArray += '<span class="configObject configObjectSeparator">,</span>';  
	}

	formattedArray += '</span>],';

	return formattedArray;
}

function formatDynamicId(dynamicIDsArray){

	var formattedArray = 'dynamicIdentifiers:[<span>';

	for(var i = 0; i<dynamicIDsArray.length; i++){

		formattedArray += '<span class="configObject">{selector:<span>"'+dynamicIDsArray[i].selector+'"</span>,</span>';
		formattedArray += '<span class="configObject">criteria:<span>"'+dynamicIDsArray[i].criteria+'"</span>,</span>';
		formattedArray += '<span class="configObject">values:<span>';
		for(var j = 0; j<dynamicIDsArray[i].values.length; j++){		
			formattedArray += '"'+dynamicIDsArray[i].values[j]+'"<span class="configObjectSeparator">,</span>';
		}
		formattedArray +='</span>}</span>';
		formattedArray += '<span class="configObject configObjectSeparator">,</span>';  
	}

	formattedArray += '</span>]';

	return formattedArray;
}


function formatElements(elementsArray){

  var formattedArray = 'elements:[<span>';

  for(var i = 0; i<elementsArray.length; i++){

    formattedArray += '<span class="configObject">{id:<span>'+elementsArray[i].id+'</span>,</span>';
    formattedArray += '<span class="configObject">name:<span>"'+elementsArray[i].name+'"</span>,</span>';
    formattedArray += '<span class="configObject">fallback:<span>"'+elementsArray[i].fallback+'"</span>,</span>';
    formattedArray += '<span class="configObject">regex:{';
    formattedArray += '<span class="configObject">include:[<span>"'+elementsArray[i].regex.include+'"</span>],</span>';
    formattedArray += '<span class="configObject">exclude:[<span>"'+elementsArray[i].regex.exclude+'"</span>]</span>';
    formattedArray += '},</span>';
    formattedArray += '<span class="configObject">capture:{';
    formattedArray += '<span class="configObject">type:<span>"'+elementsArray[i].captureType+'"</span>,</span>';
    formattedArray += '<span class="configObject">useMappings:<span>'+elementsArray[i].captureUseMappings+'</span>,</span>';
    formattedArray += '<span class="configObject">mappingCriteria:<span>"'+elementsArray[i].captureCriteria+'"</span>,</span>';
    formattedArray += '<span class="configObject">element:<span>"'+elementsArray[i].captureSelector+'"</span></span>';
    formattedArray += '},</span>';
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

function appLog(name, message){

	console.log(name + ': ' + message)
}