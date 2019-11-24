#!/usr/bin/env node

/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */

const { flow, compact } = require('lodash');

const { argv, checkerConfig } = require('./src/arguments');
const { buildCheckFn } = require('./src/checkers');
const fs = require('./src/fs');
const git = require('./src/git');

const { path: repo, checkers: selectedCheckers } = argv;
const FILE_EXCLUDES = flow(
  fs.readLines,
  compact,
)(argv.excludes);

const checkFn = buildCheckFn({
  readGitHistoryFn: git.getHistory,
  readLinesFn: fs.readLines,
  readFilesFn: (dir) => fs.getFiles(dir, FILE_EXCLUDES),
  // eslint-disable-next-line no-console
  onCheckResult: (results) => results.length && console.log(results),
});

(async () => {
  const result = checkFn(repo, selectedCheckers, {}, checkerConfig);

  process.exit(!result ? 1 : 0);
})();
