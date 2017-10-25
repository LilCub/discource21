export default Ember.Component.extend({
  classNames: ['dashboard-stats'],

  init() {
    this._super();
    if (!this.get('description')) {
      this.set('description', this.get('title'));
    }
  }
});
