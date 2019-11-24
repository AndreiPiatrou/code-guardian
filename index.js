#!/usr/bin/env node

const { compact, curryRight } = require('lodash');
const chalk = require('chalk');

const { argv, checkerConfig } = require('./src/arguments');
const { buildCheckFn } = require('./src/checkers');
const fs = require('./src/fs');
const git = require('./src/git');
const { output } = require('./src/output');

const { path: repo, checkers: selectedCheckers } = argv;
const FILE_EXCLUDES = compact(fs.readLines(argv.excludes));

const checkFn = buildCheckFn({
  readLinesFn: fs.readLines,
  readFilesFn: curryRight(fs.getFiles)(FILE_EXCLUDES),
  // eslint-disable-next-line no-console
  onCheckResult: curryRight(output)({ target: argv.o, log: console.log, chalk }),
});

(async () => {
  const result = checkFn(repo, selectedCheckers, {}, checkerConfig);

  process.exit(!result ? 1 : 0);
})();
