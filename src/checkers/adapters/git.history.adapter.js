const { flow } = require('lodash');

function adapt(base, { readGitHistoryFn, onCheckResult }) {
  return function check(repo, context, config) {
    return flow(
      readGitHistoryFn,
      (history) => {
        const historyResults = base(history, context, config);

        if (onCheckResult && historyResults.length) {
          onCheckResult(historyResults); // single side effect that is allowed here
        }

        return historyResults;
      },
    )(repo);
  };
}

module.exports = adapt;
