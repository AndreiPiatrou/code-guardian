const assert = require('assert');
const sinon = require('sinon');
const chalk = require('chalk');

const { checkers } = require('../src/checkers');
const { write, writers } = require('../src/output');

describe('checkers.js', () => {
  describe('#outputs', () => {
    it('all output formats should support all checkers', () => {
      const results = checkers.map((checker) => ({
        checker,
      }));

      const dependencies = {
        log: () => {},
        color: sinon.stub(chalk),
      };

      writers.forEach((target) => {
        assert.doesNotThrow(() => write(results, { target, ...dependencies }));
      });
    });
  });
});
