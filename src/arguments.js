/* eslint-disable import/order */

const path = require('path');
const { pick } = require('lodash');

const { checkers } = require('./checkers');

const { argv } = require('yargs')
  .option('path', {
    alias: 'p',
    describe: 'Repo path to check',
    default: './',
  })
  .option('excludes', {
    alias: 'e',
    describe: 'File path to excludes file',
    default: path.join(__dirname, '../', '.fileignore'),
  })
  .option('entropyThreshold', {
    default: 2,
  })
  .option('checkers', {
    array: true,
    choices: checkers,
    describe: 'Specify checkers to be used',
    default: [],
  });

module.exports = {
  argv,
  checkerConfig: pick(argv, 'entropyThreshold'),
};
