const assert = require('chai').assert;
const errors = require('../../../lib/chartmogul/errors/');

/**
 * Creates error object.
 * @param {string} key  - Error type
 * @returns {Object} - The error object
 */
function createError (key) {
  return new errors[key]('This is a test error', 404);
}

describe('Error', function () {
  Object.keys(errors).forEach(function (errorClass) {
    describe('#' + errorClass, function () {
      var error = createError(errorClass);
      it('should be instance of Error', function () {
        assert.isTrue(error instanceof Error);
        assert.isTrue(Error.prototype.isPrototypeOf(error));
      });
      it('should be instance of ChartMogulError', function () {
        assert.isTrue(error instanceof errors.ChartMogulError);
        assert.isTrue(errors.ChartMogulError.prototype.isPrototypeOf(error));
      });

      it('should identify as an Error object - [object Error]',
        function () {
          assert(Object.prototype.toString.call(error), '[object Error]');
        });

      it('should have name of ' + errorClass, function () {
        assert.equal(error.name, errorClass);
      });

      it('should have httpStatus of 404', function () {
        assert.equal(error.httpStatus, 404);
      });

      it('should have a valid stack trace', function () {
        assert.property(error, 'stack');
        assert.include(
          error.stack.split('\n')[0], errorClass + ': This is a test error'
        );
        assert.include(error.stack.split('\n')[2], 'createError');
      });
    });
  });
});
