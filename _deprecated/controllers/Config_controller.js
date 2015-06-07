/*
* CONFIG. Just displaying, we need view but no controller.
*
* @timeStamp - A random alphanumeric string of characters, used to namespace storage. Can be changed in order to clear all stored elements for future updates
*/
App.ConfigView = Ember.View.extend({
	controllerName: 'ConfigView',
	timeStamp: '',
	uuid: '',
	didInsertElement : function(){//Function executed after the object is inserted on the template

		this._super();
		appLog(this.controllerName,'Rendering config element');

		/*** We need to set the pages/elements objects after inserting the view, as properties can be observed from fixtures, but not updated after controller.init() ***/
		var pageArray = [];
		var page = {};	
		var elementArray = [];
		var element = {};
		var regex = {};
		var pixelArray = [];
		var pixel = {};	

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

		for(var x = 0; x<App.Pixel.FIXTURES.length; x++){

			pixel.id = App.Pixel.FIXTURES[x].id;
			pixel.name = App.Pixel.FIXTURES[x].name;
			pixel.active = App.Pixel.FIXTURES[x].active;
			pixel.pixelType = App.Pixel.FIXTURES[x].pixelType;
			pixel.pages = App.Pixel.FIXTURES[x].pages;
			pixel.elements = App.Pixel.FIXTURES[x].elements;
			pixel.config = App.Pixel.FIXTURES[x].config;

			pixelArray.push(pixel);
			pixel = {};
		}

		$('.configObject.pages').empty();
		$('.configObject.elements').empty();
		$('.configObject.pixels').empty();

		appLog(this.controllerName, 'appending pages to the object');
	  	$('.configObject.pages').append(formatPages(pageArray));

	  	appLog(this.controllerName, 'appending elements to the object');
  		$('.configObject.elements').append(formatElements(elementArray));

  		appLog(this.controllerName, 'appending pixels to the object');
  		$('.configObject.pixels').append(formatPixels(pixelArray));
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

function formatPages(pagesArray){

  var formattedArray = 'pages:[<span>';

  for(var i = 0; i<pagesArray.length; i++){

    formattedArray += '<span class="configObject">{id:<span>'+pagesArray[i].id+'</span>,</span>';
    formattedArray += '<span class="configObject">name:<span>"'+pagesArray[i].name+'"</span>,</span>';
    formattedArray += '<span class="configObject">type:<span>"'+pagesArray[i].pageType+'"</span>,</span>';
    formattedArray += '<span class="configObject">'+formatAddresses(pagesArray[i].addresses)+'</span>';
    formattedArray += '<span class="configObject">elements:[<span>'+pagesArray[i].elements+'</span>]}</span>';
    //formattedArray += '<span class="configObject">'+formatDynamicId(pagesArray[i].dynamicIdentifiers)+'}</span>';
    formattedArray += '<span class="configObject configObjectSeparator">,</span>';  
  }

  formattedArray += '</span>],';

  return formattedArray;
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

	return formattedArray;
}

function formatPixels(pixelsArray){

	var formattedArray = 'pixels:[<span>';

	for(var i = 0; i<pixelsArray.length; i++){

		formattedArray += '<span class="configObject">{id:<span>'+pixelsArray[i].id+'</span>,</span>';
		formattedArray += '<span class="configObject">name:<span>"'+pixelsArray[i].name+'"</span>,</span>';
		formattedArray += '<span class="configObject">type:<span>"'+pixelsArray[i].pixelType+'"</span>,</span>';
		formattedArray += '<span class="configObject">pages:[<span>'+pixelsArray[i].pages+'</span>],</span>';
		formattedArray += '<span class="configObject">elements:[<span>'+pixelsArray[i].elements+'</span>],</span>';
		formattedArray += '<span class="configObject">config:{<span>';

		switch(pixelsArray[i].pixelType){

		  		case 've':

		  			formattedArray += '<span class="configObject">journeyCode:<span>"'+pixelsArray[i].config+'"</span></span>';
		  			break;
		  		case 'flex':

		  			formattedArray += '<span class="configObject">flexId:<span>"'+pixelsArray[i].config+'"</span></span>';
		  			break;
		  		case 'dbm':

		  			formattedArray += '<span class="configObject">cat:<span>"'+pixelsArray[i].config[0]+'"</span>,</span>';
		  			formattedArray += '<span class="configObject">src:<span>"'+pixelsArray[i].config[1]+'"</span></span>';
		  			break;
		  		case 'appNexus':

		  			formattedArray += '<span class="configObject">segmentROS:<span>"'+pixelsArray[i].config[0]+'"</span>,</span>';
		  			formattedArray += '<span class="configObject">segmentProduct:<span>"'+pixelsArray[i].config[1]+'"</span>,</span>';
		  			formattedArray += '<span class="configObject">segmentConversion:<span>"'+pixelsArray[i].config[2]+'"</span>,</span>';
		  			formattedArray += '<span class="configObject">conversionId:<span>"'+pixelsArray[i].config[3]+'"</span></span>';		  			
		  			break;
		  		case 'customROS':

		  			formattedArray += '<span class="configObject">type:<span>"script"</span>,</span>';
		  			formattedArray += '<span class="configObject">src:<span>"'+pixelsArray[i].config+'"</span></span>';
		  			break;
		  		case 'customConversion':

		  			formattedArray += '<span class="configObject">type:<span>"script"</span>,</span>';
		  			formattedArray += '<span class="configObject">src:<span>"'+pixelsArray[i].config+'"</span></span>';
		  			break;
		  	}

		formattedArray += '},</span></span>';

		formattedArray += '<span class="configObject">overrides:{';
		formattedArray += '<span class="configObject">active:<span>'+pixelsArray[i].active+'</span>,</span>';
		formattedArray += '<span class="configObject">pages:[<span>'+pixelsArray[i].pages+'</span>],</span>';
		formattedArray += '<span class="configObject">elements:[<span>'+pixelsArray[i].elements+'</span>],</span>';
		formattedArray += '<span class="configObject">ros:<span>true</span>}</span>';
		formattedArray += '}</span>';
		formattedArray += '<span class="configObject configObjectSeparator">,</span>';  
	}

	formattedArray += '</span>]';

	return formattedArray;
}