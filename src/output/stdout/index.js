const writers = require('require-all')({
  dirname: __dirname,
});

function summary(results, { log, color: c }) {
  const color = results.length ? 'red' : 'green';

  log(`Total: ${c[color](results.length)}`);
}

function write(value, { log, ...rest }) {
  writers[value.checker](value, { log, ...rest });
  log();
}

module.exports = {
  summary,
  write,
};
