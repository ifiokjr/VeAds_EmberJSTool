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

			if ((name === undefined || name === '') || type === undefined || urls.length == 0) { 

		  		displayAlert('pages-index','Fill up all the fields please...','danger');
		  		return; 
		  	}

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
			hideAlert();

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
