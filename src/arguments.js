/* eslint-disable import/order */

const path = require('path');
const { pick, compact } = require('lodash');
const fs = require('fs');

const { checkers } = require('./checkers');
const { writers } = require('./output');

const EXCLUDES_FILENAME = '.fileignore';

const { argv } = require('yargs')
  .option('path', {
    alias: 'p',
    describe: 'Repo path to check',
    default: './',
  })
  .option('excludes', {
    alias: 'e',
    describe: 'File path to excludes file. Default: code-guardian package default excludes.',
  })
  .option('entropyThreshold', {
    default: 2,
  })
  .option('gitCommitHistoryDepth', {
    alias: 'g',
    default: 1000,
    describe: 'Commit history depth to check',
  })
  .option('checkers', {
    array: true,
    choices: checkers,
    describe: 'Specify checkers to be used',
    default: [],
  })
  .option('output', {
    alias: 'o',
    choices: writers,
    describe: 'Specify result output',
    default: 'stdout',
  });

// yargs does not support good callback API so do extra transformation manually
function findExcludesPath(options) {
  const { path: repoPath, excludes: excludesFromArgs } = options;
  const possibleExcludesPathsByPriority = compact([
    excludesFromArgs,
    path.join(repoPath, EXCLUDES_FILENAME),
    path.join(__dirname, '../', EXCLUDES_FILENAME),
  ]);
  const firstFoundExcludes = possibleExcludesPathsByPriority.find(fs.existsSync);

  return {
    ...options,
    excludes: firstFoundExcludes,
    e: firstFoundExcludes,
  };
}

module.exports = {
  argv: findExcludesPath(argv),
  checkerConfig: pick(argv, 'entropyThreshold'),
};
