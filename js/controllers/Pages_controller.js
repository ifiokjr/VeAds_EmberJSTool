/**
*
* Controller associated to the template 'page'.
*/
VeAds.PageController = Ember.ArrayController.extend({
  actions: {
    createPage: function() {
      // Get the page name by the newPage field
      var name = this.get('newName');
      if (!name.trim()) { return; }

      // Create the new Page model
      var page = this.store.createRecord('Page', {
        id: $('.pageLine').length+1,
        name: name,
        pageType: 'page type',
        addresses: 'addresses'
      });

      // Clear the "newName" text field
      this.set('newName', '');

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