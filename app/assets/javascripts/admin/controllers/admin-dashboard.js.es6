export default Ember.Controller.extend({
  loading: false,
  versionCheck: null,
  _dashboardFetchedAt: null,

  fetchDashboard() {
    let timeFrame = moment().subtract(30, 'minutes');
    if ((this._dashboardFetchedAt || timeFrame) <= timeFrame) {
      this._dashboardFetchedAt = new Date();
      this.set('loading', true);
      this.store.find('dashboard').then(d => {
        this.set('dashboard', d);
      }).finally(() => this.set('loading', false));
    }
  },

  actions: {
    showTrafficReport() {
      this.set("showTrafficReport", true);
    }
  }
});
