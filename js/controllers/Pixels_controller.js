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
			var pages = [];
		  	var elements = [];
		  	var config = [];

			if (name === undefined || name === '') { 

		  		displayAlert('pixels-index','Fill up all the fields please...','danger');
		  		return; 
		  	}

		  	if ($('.pixels-index .dropdown input[type=checkbox]:checked').length < 1) { 

		  		displayAlert('pixels-index','Select at least one page where to deploy this pixels please...','danger');
		  		return; 
		  	}

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
			    name: name,
			    pixelType: type,
			    pages: pages,
			    elements: elements,
			    config: config
		  	});

		  	this.set('newPixName', '');
			/*this.set('newESelector', '');
			this.set('newEregexExclude', '');
			this.set('newEregexInclude', '');
			this.set('newEfallback', '');*/
			$('.dropdown input[type=checkbox]:checked').attr('checked', false);
			$('.checkedSelected').text(0);
			$('.dropdown dd ul').hide('fast');
			hideAlert();

			element.save();
		},    
	    deletePixel: function(pixel) {

	      if(confirm('Are you sure you want to delete this Pixel?')){

	        pixel.deleteRecord();
	        pixel.save();
	        this.transitionToRoute('pixels.index');
	      }
	    }
	}
});