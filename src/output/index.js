const { isArray, without } = require('lodash');
const writers = require('require-all')({
  dirname: __dirname,
});

const DEFAULT_WRITER = 'index';

function output(results, { target, ...dependencies }) {
  const array = isArray(results) ? results : [results];
  const writeByTarget = writers[target][DEFAULT_WRITER];

  array.forEach((value) => {
    writeByTarget.write(value, dependencies);
    writeByTarget.divide(dependencies);
  });
}

function summary(results, { target, ...dependencies }) {
  writers[target][DEFAULT_WRITER].summary(results, dependencies);
}

module.exports = {
  output,
  writers: without(Object.keys(writers), 'index'),
  summary,
};
