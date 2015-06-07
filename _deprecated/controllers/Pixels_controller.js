/****************
*
* PIXEL INDEX Controller.
*
****************/
App.PixelsIndexView = Ember.View.extend({
	controllerName: 'PixelsIndexController',
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


		$('.pixels-index select').on('change', function(){

			$('.pixels-index .tab-pane').removeClass('active');
			$('.pixels-index .tab-pane#new'+$('.pixels-index select option:selected').val()).addClass('active');
			$('.pixels-index input').val('');
		});

		$('#newPixActive').click(function(){

			$('#pagesToApplyPixel').toggle(300);
		});
	}
});

App.PixelsIndexController = Ember.Controller.extend({
	controllerName: 'PixelsIndexController',
	pixelTypeElements : ['ve','flex','dbm','appNexus','customROS','customConversion'],
	actions: {
		createPixel: function() {

			appLog(this.controllerName,'pixel creation');
			var name = this.get('newPixName');
			var type = $('#newTypePages select option:selected').val();
			var active = this.get('newPixActive');
			var pages = [];
		  	var elements = [];
		  	var config = [];

			if (name === undefined || name === '') { 

		  		displayAlert('pixels-index','Fill up all the fields please...','danger');
		  		return; 
		  	}

		  	/*if ($('.pixels-index .dropdown input[type=checkbox]:checked').length < 1) { 

		  		displayAlert('pixels-index','Select at least one page where to deploy this pixels please...','danger');
		  		return; 
		  	}*/


console.log("activeeeeeeee: " + active);
		  	if(active === false || active === undefined){

				appLog(this.controllerName, 'Pixel not active');
			}else{

				appLog(this.controllerName, 'Pixel active');
			  	//Selecting the clicked pages
				$('.pixels-index .dropdown input[type=checkbox]:checked').each(function(i, selected){ 
					pages[i] = $(selected).val(); 
				});

			  	//Retrieving the elements from the pages
				for(var i = 0; i < App.Element.FIXTURES.length; i++){

					for(var j = 0; j < pages.length; j++){

						if(App.Element.FIXTURES[i].pages.indexOf(pages[j]) >= 0){

							appLog(this.controllerName, 'Page '+ pages[j] +' selected, including element ' + App.Element.FIXTURES[i].id + ' related');
							elements.pushUnique(App.Element.FIXTURES[i].id);					
						}
					}
				}
			}

		  	//Selecting the configuration depending on the pixel type
		  	switch(type){

		  		case 've':

		  				config.push(this.get('newjourneyCode'));
		  			break;
		  		case 'flex':

		  				config.push(this.get('newflexId'));
		  			break;
		  		case 'dbm':

		  				config.push(this.get('newCat'));
		  				config.push(this.get('newSrc'));
		  			break;
		  		case 'appNexus':

						config.push(this.get('newsegmentROS'));
						config.push(this.get('newsegmentProduct'));
						config.push(this.get('newsegmentConversion'));
						config.push(this.get('newconversionId'));
		  			break;
		  		case 'customROS':

		  				config.push(this.get('newcustomROS'));
		  			break;
		  		case 'customConversion':

		  				config.push(this.get('newcustomConversion'));
		  			break;
		  	}

		  	var element = this.store.createRecord('Pixel', {

		    	id: nextID(App.Pixel.FIXTURES),
		    	active: active,
			    name: name,
			    pixelType: type,
			    pages: pages,
			    elements: elements,
			    config: config
		  	});

		  	this.set('newPixName', '');
			this.set('newjourneyCode', '');
			this.set('newflexId', '');
			this.set('newCat', '');
			this.set('newSrc', '');
			this.set('newsegmentROS', '');
			this.set('newsegmentProduct', '');
			this.set('newsegmentConversionn', '');
			this.set('ewconversionId', '');
			this.set('newcustomROSn', '');
			this.set('ewcustomConversion', '');
			$('.dropdown input[type=checkbox]:checked').attr('checked', false);
			$('.checkedSelected').text(0);
			$('.dropdown dd ul').hide('fast');
			hideAlert();

			element.save();
		}
	}
});

/*****************
* PIXEL CONTROLLER: controller for the display of the created pixels view
* 
* edit: sets the edit mode available.
* doneEditing: saves the changes and sets the editing mode off.
*****************/
App.PixelController = Ember.ObjectController.extend({
	controllerName: 'PageController',
	isEditing: false,
	actions:{
		edit: function(){

			appLog(this.controllerName,'edit mode activated for pixel ' + this.get('id'));
			this.set('isEditing', true);
		},
		doneEditing: function(pixel){

			var elements = [];
			var pages = this.get('pages');

			appLog(this.controllerName,'editing the pixel with id ' + this.get('id'));

			pixel.set('name', this.get('name'));
			pixel.set('config', this.get('config'));

			for(var i = 0; i < App.Page.FIXTURES.length; i++){

				if(pages.indexOf(App.Page.FIXTURES[i].id) >= 0){

					elements.pushUnique(App.Page.FIXTURES[i].elements);
				}
			}

			appLog(this.controllerName, 'new elements for this pixel ' + elements);
			pixel.set('pages', pages);
			pixel.set('elements', elements);

			pixel.save();
			this.set('isEditing', false);
		}
	}
});