/*******************************
*
* PIXEL MODEL
* 
* @pixelType ['ve','flex','dbm','appNexus','customROS','customConversion']
* @addresses  - array of address objects with url + params || url
* @elements - array of element IDs applied to this page
*******************************/
App.Pixel = DS.Model.extend({
  name: DS.attr('string'),
  pixelType: DS.attr('string'),
  active: DS.attr('string'),
	config: DS.attr('array'),
	pages: DS.attr('array'),
	elements: DS.attr('array')
});


      /**
       * Sometimes we only want to fire on certain pages.
       * Without this, it defaults to firing on all pages that have the correct
       * page type.
       *
       * Don't use this unless a client has requested different configurations to
       * be used for the same pixel within one website.
       *
       * At times clients need a different set up for different conversion pixels. In
       * this case we set up two pages, and an overrides object for the relevant pixels
       * referencing the correct page. The tool abstracts this complexity away.
       *
       *
       * @type {Object}
       *
       * @property {Boolean} active - only use the overrides object if it is active
       * @property {Boolean} ros - set to true if it should use it's ROS pixel on all pages
       *                         if there is no ROS implementation then this is ignored.
       * @property {Array} pages - the only pages that this pixel should use
       * @property {Array} data - elements to be used when populating the dynamic parts of src
       *                        	if no length then it defaults to the first dataElement with
       *                        	the correct type.
       */
App.Pixel.FIXTURES = [
    {
      id: 1,
      name: 'Main Products Integration',
      active:false,
      pixelType: 've',
      config: ['adsfasdf'],
      pages: [],
      elements: []
    },

    {
      id: 2,
      name: 'flex Integration',
      active:false,
      pixelType: 'flex',
      config: ['123456'],
      pages: [],
      elements: []
    },

    {
      id: 3,
      name: 'dbm Integration',
      active:false,
      pixelType: 'dbm',
      config: ['asdf','fdas'],
      pages: [],
      elements: []
    },
        {
      id: 4,
      pixelType: 'appNexus',
      name: 'nexus Integration',
      active:false,
      config: ['111111', '222222','333333','654321'],   
      pages: [],
      elements: []
    },

    {
      id: 5,
      pixelType: 'customROS',
      name: 'customROS Integration', 
      active:false,   
      config: ['https://trackingpixels.com/haha?i=can&see=you'],     
      pages: [],
      elements: []
    },

    {
      id: 5,
      pixelType: 'customConversion',
      name: 'customConversion Integration',
      active:false,
      config: ['https://trackingpixels.com/i/?know=what&you=bought'],
      pages: [],
      elements: []
    }];
