export default Ember.Route.extend({
  setupController(controller) {
    controller.fetchDashboard();
  }
});
