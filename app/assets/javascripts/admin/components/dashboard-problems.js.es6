const PROBLEMS_CHECK_MINUTES = 1;

export default Ember.Component.extend({
  tagName: '',
  store: Ember.inject.service(),
  problemsFetchedAt: null,
  hadProblems: false,

  didInsertElement() {
    this._super();
    if (!this.currentUser.get('admin')) {
      return;
    }

    let target = moment().subtract(PROBLEMS_CHECK_MINUTES, 'minutes').toDate();
    let fetchedAt = this.get('problemsFetchedAt') || target;
    this.set('hadProblems', false);
    if (fetchedAt <= target) {
      this.loadProblems();
    }
  },

  loadProblems() {
    this.set('loadingProblems', true);
    this.set('problemsFetchedAt', new Date());

    this.store.findAll('dashboard-problem').then(d => {
      this.set('problems', d);
      this.set('hadProblems', this.get('hadProblems') || d.totalRows > 0);
    }).finally(() => {
      this.set('loadingProblems', false);
    });
  },

  actions: {
    refreshProblems() {
      this.loadProblems();
    }
  }
});
