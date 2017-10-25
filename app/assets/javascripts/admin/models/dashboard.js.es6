import RestModel from 'discourse/models/rest';

const REPORTS = [
  'global_reports',
  'page_view_reports',
  'private_message_reports',
  'http_reports',
  'user_reports',
  'mobile_reports'
];

const Dashboard = RestModel.extend();

Dashboard.reopenClass({
  munge(json, store) {
    if (json.version_check) {
      json.versionCheck = store.createRecord('version-check', json.version_check);
      delete json.version_check;
    }

    REPORTS.forEach(name => {
      json[name] = json[name].map(r => store.createRecord('report', r));
    });

    return json;
  }
});

export default Dashboard;
