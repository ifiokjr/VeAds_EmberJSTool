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


		  	if ((name === undefined || name === '') || captureSelector === undefined) { 

		  		displayAlert('elements-index','Fill up all the fields please...','danger');
		  		return; 
		  	}

		  	if ($('.elements-index .dropdown input[type=checkbox]:checked').length < 1) { 

		  		displayAlert('elements-index','Select at least one page where to apply this element please...','danger');
		  		return; 
		  	}

			var pages = [];

			$('.elements-index .dropdown input[type=checkbox]:checked').each(function(i, selected){ 
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
		  				
		  				appLog(this.controllerName,'double binding element with page id: ' + App.Page.FIXTURES[ii].id);
						App.Page.FIXTURES[ii].elements.pushUnique(element.id);

						for(var iii = 0; iii < App.Pixel.FIXTURES.length; iii++){

							if(App.Pixel.FIXTURES[iii].pages.indexOf(pages[i]) >= 0 ){
				  				
				  				appLog(this.controllerName,'updating pixel elements for page id: ' + App.Page.FIXTURES[ii].id);
								App.Pixel.FIXTURES[iii].elements.pushUnique(App.Page.FIXTURES[ii].elements);
							}
						}
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
			hideAlert();

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
							App.Page.FIXTURES[i].elements.pushUnique(elemID);
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
