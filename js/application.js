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

Array.prototype.pushUnique = function (item){

	if(item instanceof Array){

		for(var i = 0 ; i < item.length ; i++){

			if(this.indexOf(item[i]) == -1) {

		        this.push(item[i]);
	    	}
		}
		return true;
	}else{

		if(this.indexOf(item) == -1) {

	        this.push(item);
	        return true;
    	}
	}
    return false;
}

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
* SUPPORT FUNCTIONS
*/

/************
*
* displayAlert - Displays alert on the specified slots
*
*@element - String - Class of the element where to display the alert (page-index...)
*@message - String - Message to display
*@status - String - Status of the message. 
************/
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

/************
*
* hideAlert - hides the alerts displayed
*
**************/
function hideAlert(){

	$('.alert').alert('close');
}

function IsURL(url) {

	var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
	return regexp.test(url);
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






















