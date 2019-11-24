const {
  zip, compact, flow, get,
} = require('lodash');

const gitHistoryAdapter = require('./adapters/git.history.adapter');

const SINGLE_WORD_MESSAGE = /^\S*$/;

const toPairs = (history) => zip(history, history.slice(1));
function singleWord(commit) {
  return SINGLE_WORD_MESSAGE.test(commit.message)
    ? `Message "${commit.message}" is a single word`
    : false;
}
function repeating(first, second) {
  return get(first, 'message') === get(second, 'message')
    ? `Message "${first.message}" is repeated in a row`
    : false;
}
function attachDetails(fn) {
  return (first, second) => {
    const message = fn(first, second);

    return message
      ? { message, author: first.authorName, hash: first.hash }
      : false;
  };
}

const ASPECT_FNS = [
  attachDetails(singleWord),
  attachDetails(repeating),
];

function check(history, context) {
  return toPairs(history).reduce((results, pair) => {
    const pairResults = flow(
      ([first, second]) => ASPECT_FNS.map((fn) => fn(first, second)),
      compact,
      (prs) => prs.map((result) => ({ ...context, ...result })),
    )(pair);

    return [...results, ...pairResults];
  }, []);
}

module.exports = (dependencies) => gitHistoryAdapter(check, dependencies);
