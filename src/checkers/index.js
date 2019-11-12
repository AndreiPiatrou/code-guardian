const { compact, pick, reduce } = require('lodash');

const checkers = require('require-all')({
  dirname: __dirname,
  excludeDirs: 'decorators',
  filter: /^((?!index).*)\.js$/,
});

function filterCheckers(allCheckers, selectedCheckers) {
  return selectedCheckers.length
    ? pick(allCheckers, selectedCheckers)
    : allCheckers;
}

function buildCheckFn(dependencies) {
  return function check(repo, selectedCheckers, context, config) {
    const filteredCheckers = filterCheckers(checkers, selectedCheckers);

    return reduce(filteredCheckers, (results, checkFn, checker) => compact([
      ...results,
      ...checkFn(dependencies)(repo, { ...context, checker }, config),
    ]), []);
  };
}

module.exports = {
  checkers: Object.keys(checkers),
  buildCheckFn,
};
