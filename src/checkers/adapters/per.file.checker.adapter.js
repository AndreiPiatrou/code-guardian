const { flow, compact, tap } = require('lodash');

function adapt(base, { readFilesFn, onCheckResult = () => {} }) {
  return function check(repo, context, config) {
    return flow(
      readFilesFn,
      (files) => files.reduce((results, file) => {
        const perFileResults = compact(base(file, { ...context, file }, config));

        return [...results, ...tap(perFileResults, onCheckResult)];
      }, []),
      compact,
    )(repo);
  };
}

module.exports = adapt;
