/**
*
* CONTROLLERS.
* IMPORTANT: The page controllers are related to the ROUTING names
*/

App.NewPageController = Ember.ArrayController.extend({
  actions: {
    createPage: function() {
      // Get the page name by the newPage field
      var name = this.get('newName');
      var type = this.get('newType');
      var url = this.get('newUrl');

      if (!name.trim() || !type.trim() || !url.trim()) { return; }

      // Create the new Page model
      var page = this.store.createRecord('Page', {

        id: App.Page.FIXTURES[App.Page.FIXTURES.length-1].id+1,
        // id: $('.pageLine').length+1,
        name: name,
        pageType: type,
        addresses: url
      });

      // Clear the "newName" text field
      this.set('newName', '');
      this.set('newType', '');
      this.set('newUrl', '');

      // Save the new model
      /* Save returns a promise. These are used to handle the exit or failure of the saving.
      [:TODO] - Investigate about this.
            var self = this;

            function transitionToPost(post) {
                self.transitionToRoute('posts.show', post);
            }

            function failure(reason) {
              // handle the error
            }

             post.save().then(transitionToPost).catch(failure):
      */
      page.save();
    }
  }
});