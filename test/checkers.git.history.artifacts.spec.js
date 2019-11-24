const assert = require('assert');

const buildCheck = require('../src/checkers/git.history.artifacts');

describe('git.history.artifacts.js', () => {
  it('returns false for not duplicated messages', () => {
    const subject = buildCheck({
      readGitHistoryFn: () => [{
        hash: 'hash-1',
        authorName: 'authorName',
        authorEmail: 'authorEmail',
        message: 'message 1',
      }, {
        hash: 'hash-1',
        authorName: 'authorName',
        authorEmail: 'authorEmail',
        message: 'message 2',
      }],
    });
    const results = subject('./');

    assert.deepStrictEqual(results, []);
  });

  it('returns an informative message for duplicated messages', () => {
    const subject = buildCheck({
      readGitHistoryFn: () => [{
        hash: 'hash-1',
        authorName: 'authorName',
        authorEmail: 'authorEmail',
        message: 'duplicated message',
      }, {
        hash: 'hash-1',
        authorName: 'authorName',
        authorEmail: 'authorEmail',
        message: 'duplicated message',
      }],
    });
    const results = subject('./');

    assert.deepStrictEqual(results, [{
      author: 'authorName',
      hash: 'hash-1',
      message: 'Commit message is repeated in a row',
      commit: 'duplicated message',
    }]);
  });

  it('returns an informative message for single-word message', () => {
    const subject = buildCheck({
      readGitHistoryFn: () => [{
        hash: 'hash-1',
        authorName: 'authorName',
        authorEmail: 'authorEmail',
        message: 'single-word-commit-message',
      }],
    });
    const results = subject('./');

    assert.deepStrictEqual(results, [{
      author: 'authorName',
      hash: 'hash-1',
      message: 'Commit message is a single word',
      commit: 'single-word-commit-message',
    }]);
  });
});
