const { merge, flow } = require('lodash');
const gitLog = require('gitlog');


const DEFAULT_OPTIONS = {
  repo: `${__dirname}/test-repo-folder`,
  number: 10,
  fields: [
    'hash',
    'authorName',
    'authorEmail',
    'rawBody',
  ],
};

function normalize({
  hash, authorName, authorEmail, rawBody,
}) {
  return {
    hash,
    authorName,
    authorEmail,
    message: rawBody,
  };
}

function getHistory(dir, options = {}) {
  return flow(
    (repo) => merge(DEFAULT_OPTIONS, options, { repo }),
    gitLog,
    (history) => history.map(normalize),
  )(dir);
}

module.exports = {
  getHistory,
};
