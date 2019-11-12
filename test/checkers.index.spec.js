const assert = require('assert');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('index.js', () => {
  describe('#checkers', () => {
    it('returns array with checkers keys when checkers are present', () => {
      const { checkers } = proxyquire('../src/checkers', {
        'require-all': sinon.stub().returns({ testKey1: 'testValue1', testKey2: 'testValue2' }),
      });

      assert.deepStrictEqual(checkers, ['testKey1', 'testKey2']);
    });

    it('returns empty array when there are no checkers', () => {
      const { checkers } = proxyquire('../src/checkers', {
        'require-all': sinon.stub().returns({}),
      });

      assert.deepStrictEqual(checkers, []);
    });
  });

  describe('#buildCheckFn', () => {
    const repo = sinon.stub();
    const config = sinon.stub();
    const dependencies = sinon.stub();
    const testCheckerFn = sinon.stub();
    const anotherTestCheckerFn = sinon.stub();
    const checkerContext = { context: 'testContext' };

    const { buildCheckFn } = proxyquire('../src/checkers', {
      'require-all': () => ({
        testChecker: testCheckerFn,
        anotherTestChecker: anotherTestCheckerFn,
      }),
    });

    beforeEach(() => {
      testCheckerFn.withArgs(dependencies).returns(testCheckerFn);
      anotherTestCheckerFn.withArgs(dependencies).returns(anotherTestCheckerFn);

      testCheckerFn.withArgs(repo, { context: 'testContext', checker: 'testChecker' }, config).returns(['testResult1']);
      anotherTestCheckerFn.withArgs(repo, { context: 'testContext', checker: 'anotherTestChecker' }, config).returns(['testResult2', null]);
    });

    it('executes checks against all checkers when selectedCheckers is an empty array', () => {
      const checkFn = buildCheckFn(dependencies);
      const checkResults = checkFn(repo, [], checkerContext, config);

      assert.deepStrictEqual(checkResults, ['testResult1', 'testResult2']);
    });

    it('executes checks against all checkers when selectedCheckers is not an empty array', () => {
      const checkFn = buildCheckFn(dependencies);
      const checkResults = checkFn(repo, ['testChecker'], checkerContext, config);

      assert.deepStrictEqual(checkResults, ['testResult1']);
    });
  });
});
