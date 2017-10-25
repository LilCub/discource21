import computed from 'ember-addons/ember-computed-decorators';

export default Discourse.Model.extend({

  @computed('updated_at')
  noCheckPerformed(updatedAt) {
    return updatedAt === null;
  },

  @computed('updated_at', 'version_check_pending')
  dataIsOld(updatedAt, versionCheckPending) {
    return versionCheckPending || moment().diff(moment(updatedAt), 'hours') >= 48;
  },

  @computed('dataIsOld', 'installed_version', 'latest_version', 'missing_versions_count')
  staleData(dataIsOld, installedVersion, latestVersion, missingVersionsCount) {
    return dataIsOld ||
           (installedVersion !== latestVersion && missingVersionsCount === 0) ||
           (installedVersion === latestVersion && missingVersionsCount !== 0);
  },

  @computed('missing_versions_count')
  upToDate(missingVersionsCount) {
    return missingVersionsCount === 0 || missingVersionsCount === null;
  },

  @computed('missing_versions_count')
  behindByOneVersion(missingVersionsCount) {
    return missingVersionsCount === 1;
  },

  @computed('git_branch', 'installed_sha')
  gitLink(gitBranch, installedSHA) {
    if (gitBranch) {
      return `https://github.com/discourse/discourse/compare/${installedSHA}...${gitBranch}`;
    } else {
      return `https://github.com/discourse/discourse/tree/${installedSHA}`;
    }
  },

  @computed('installed_sha')
  shortSha(installedSHA) {
    return installedSHA.substr(0, 10);
  }
});
