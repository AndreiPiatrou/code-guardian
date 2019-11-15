/* eslint-disable no-bitwise */

const { zip } = require('lodash');

const perFileAdapter = require('./adapters/per.file.checker.adapter');
const perLineAdapter = require('./adapters/per.line.checker.adapter');

const MIN_LENGTH = 10;
const LEXEME_REGEXP = /[^\s.()/\\[\]<>=;,:_]{10,}/;
const ANY_DIGIT_REGEX = /\d/;

const isDigit = (char) => !Number.isNaN(char);
const isPunctuation = (char) => ['-', '_', '+', '$', '#', '%', '!'].includes(char);
const isLower = (char) => char === char.toLowerCase() && char !== char.toUpperCase();
const isUpper = (char) => char === char.toUpperCase() && char !== char.toLowerCase();
const safeCall = (method) => (arg) => (arg ? method(arg) : false);

const TEST_METHODS = [
  safeCall(isPunctuation),
  safeCall(isLower),
  safeCall(isUpper),
  safeCall(isDigit),
];

function isRush(first, second) {
  if (isPunctuation(first) && isPunctuation(second)) {
    return true;
  }

  return TEST_METHODS.some((method) => method(first) ^ method(second));
}

function calculateEntropy(line) {
  const sequence = line.split('');

  return zip(sequence, sequence.slice(1))
    .reduce((total, [first, second]) => total + (isRush(first, second) ? 1 : 0), 0) / line.length;
}

function calculateGamma(line) {
  return line.length > MIN_LENGTH ? Math.exp((line.length - MIN_LENGTH) / MIN_LENGTH) : 1;
}

function check(line, context, { entropyThreshold }) {
  const matches = LEXEME_REGEXP.exec(line);
  const match = matches ? matches[0] : false;

  if (!match || !ANY_DIGIT_REGEX.test(match)) {
    return false;
  }

  const entropy = calculateEntropy(match) * calculateGamma(match);

  return entropy >= entropyThreshold
    ? { ...context, message: `The line may contain sensitive data (entropy: ${entropy})` }
    : false;
}

module.exports = (dependencies) => perFileAdapter(
  perLineAdapter(check, dependencies),
  dependencies,
);
