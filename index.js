#!/usr/bin/env node

const { compact, curryRight } = require('lodash');
const chalk = require('chalk');

const { argv, checkerConfig } = require('./src/arguments');
const { buildCheckFn } = require('./src/checkers');
const fs = require('./src/fs');
const git = require('./src/git');
const { output, summary } = require('./src/output');

const { log } = console;

const { path: repo, checkers: selectedCheckers } = argv;
const FILE_EXCLUDES = compact(fs.readLines(argv.excludes));
const OUTPUT_DEPS = { target: argv.o, log, chalk };

const checkFn = buildCheckFn({
  readLinesFn: fs.readLines,
  readFilesFn: curryRight(fs.getFiles)(FILE_EXCLUDES),
  onCheckResult: curryRight(output)(OUTPUT_DEPS),
});

(async () => {
  const results = checkFn(repo, selectedCheckers, {}, checkerConfig);

  summary(results, OUTPUT_DEPS);

  process.exit(!results.length ? 1 : 0);
})();
