const writers = require('require-all')({
  dirname: __dirname,
});

function divide({ log }) {
  log();
}

function summary(results, { log, chalk: c }) {
  const color = results.length ? 'red' : 'green';

  log(`Total: ${c[color](results.length)}`);
}

function write(value, ...rest) {
  writers[value.checker](value, ...rest);
}

module.exports = {
  divide,
  summary,
  write,
};
