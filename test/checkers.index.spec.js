const assert = require('assert');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('index.js', () => {
  describe('#checkers', () => {
    const requireAll = sinon.stub();

    context('when checkers are present', () => {
      beforeEach(() => {
        requireAll.returns({ testKey1: 'testValue1', testKey2: 'testValue2' });
      });

      it('returns array with checkers keys', () => {
        const { checkers } = proxyquire('../src/checkers', {
          'require-all': requireAll
        });

        assert.deepStrictEqual(checkers, ['testKey1', 'testKey2']);
      });
    });

    context('when checkers are present', () => {
      beforeEach(() => {
        requireAll.returns({});
      });

      it('returns empty array', () => {
        const { checkers } = proxyquire('../src/checkers', {
          'require-all': requireAll
        });

        assert.deepStrictEqual(checkers, []);
      });
    });
  });

  describe('#buildCheckFn', () => {
    let selectedCheckers;

    const repo = sinon.stub();
    const config = sinon.stub();
    const dependencies = sinon.stub();
    const testCheckerFn = sinon.stub();
    const anotherTestCheckerFn = sinon.stub();
    const checkerContext = { context: 'testContext' };

    const { buildCheckFn } = proxyquire('../src/checkers', {
      'require-all': () => ({
        testChecker: testCheckerFn,
        anotherTestChecker: anotherTestCheckerFn
      })
    });

    beforeEach(() => {
      testCheckerFn.withArgs(dependencies).returns(testCheckerFn);
      anotherTestCheckerFn.withArgs(dependencies).returns(anotherTestCheckerFn);

      testCheckerFn.withArgs(repo, { context: 'testContext', checker: 'testChecker' }, config).returns(['testResult1']);
      anotherTestCheckerFn.withArgs(repo, { context: 'testContext', checker: 'anotherTestChecker' }, config).returns(['testResult2', null]);
    });

    context('when selectedCheckers is empty array', () => {
      beforeEach(() => {
        selectedCheckers = [];
      });

      it('calls checks for all checkers', () => {
        const checkFn = buildCheckFn(dependencies);
        const checkResults = checkFn(repo, selectedCheckers, checkerContext, config);

        assert.deepStrictEqual(checkResults, ['testResult1', 'testResult2']);
      });
    });

    context('when selectedChecks is not empty array', () => {
      beforeEach(() => {
        selectedCheckers = ['testChecker'];
      });

      it('calls checks for all checkers', () => {
        const checkFn = buildCheckFn(dependencies);
        const checkResults = checkFn(repo, selectedCheckers, checkerContext, config);

        assert.deepStrictEqual(checkResults, ['testResult1']);
      });
    });
  });
});
