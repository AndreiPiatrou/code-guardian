const { isArray, without } = require('lodash');
const writers = require('require-all')({
  dirname: __dirname,
});

const DEFAULT_WRITER = 'index';

function write(results, { target, ...dependencies }) {
  const array = isArray(results) ? results : [results];
  const writeByTarget = writers[target][DEFAULT_WRITER];

  array.forEach((value) => {
    writeByTarget.write(value, dependencies);
  });
}

function summary(results, { target, ...dependencies }) {
  writers[target][DEFAULT_WRITER].summary(results, dependencies);
}

module.exports = {
  write,
  writers: without(Object.keys(writers), 'index'),
  summary,
};
