export default Ember.Helper.helper(function([dt], params) {
  return moment(dt).format(params.format);
});
