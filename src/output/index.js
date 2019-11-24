const { isArray, without } = require('lodash');
const writers = require('require-all')({
  dirname: __dirname,
});

const DEFAULT_WRITER = 'index';

function output(results, { target, ...dependencies }) {
  const array = isArray(results) ? results : [results];
  const writeByTarget = writers[target];

  array.forEach((value) => {
    const writeByChecker = writeByTarget[value.checker] || writeByTarget[DEFAULT_WRITER];

    writeByChecker(value, dependencies);
  });
}

module.exports = {
  output,
  writers: without(Object.keys(writers), 'index'),
};
