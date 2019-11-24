#!/usr/bin/env node

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
  readLinesFn: fs.readLines,
  readFilesFn: (dir) => fs.getFiles(dir, FILE_EXCLUDES),
  readGitHistoryFn: (dir) => git.getHistory(dir, { number: argv.gitCommitHistoryDepth }),
  // TODO: refactor with flexible outputting
  // eslint-disable-next-line no-console
  onCheckResult: (results) => results.length && console.log(results),
});

(async () => {
  const result = checkFn(repo, selectedCheckers, {}, checkerConfig);

  process.exit(!result ? 1 : 0);
})();
