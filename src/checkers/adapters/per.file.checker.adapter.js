const { flow, compact } = require('lodash');

function adapt(base, { readFilesFn, onCheckResult }) {
  return function check(repo, context, config) {
    return flow(
      readFilesFn,
      (files) => files.reduce((results, file) => {
        const perFileResults = compact(base(file, { ...context, file }, config));

        if (onCheckResult && perFileResults.length) {
          onCheckResult(perFileResults); // single side effect that is allowed here
        }

        return [...results, ...perFileResults];
      }, []),
      compact,
    )(repo);
  };
}

module.exports = adapt;
