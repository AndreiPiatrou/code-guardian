const { flow, tap } = require('lodash');

function adapt(base, { readGitHistoryFn, onCheckResult = () => {} }) {
  return function check(repo, context, config) {
    return flow(
      readGitHistoryFn,
      (history) => base(history, context, config),
      (results) => tap(results, onCheckResult),
    )(repo);
  };
}

module.exports = adapt;
