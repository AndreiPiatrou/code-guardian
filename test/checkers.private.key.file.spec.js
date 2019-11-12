const assert = require('assert');

const buildSubject = require('../src/checkers/private.keys');

describe('private.key.js', () => {
  it('returns false for non private key file', () => {
    const subject = buildSubject({ readFilesFn: () => [] });
    const results = subject('./');

    assert.deepStrictEqual(results, []);
  });

  it('returns a message for a secret string', () => {
    const subject = buildSubject({ readFilesFn: () => ['./private.key.file.pem'] });
    const [result] = subject('./');

    assert.equal(result.message, 'File ./private.key.file.pem is a private key file');
  });
});
