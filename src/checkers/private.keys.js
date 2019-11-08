const perFileDecorator = require('../decorators/checkers/per.file.checker.decorator');

// TODO: extend with other extensions
const PRIVATE_KEY_FILE_EXTENSIONS = ['pem'];

// TODO: add support of configurable keys list
function check(file, context) {
  const extension = file.split('.').pop();

  if (!extension) {
    return [];
  }

  return PRIVATE_KEY_FILE_EXTENSIONS.includes(extension.toLowerCase())
    ? [{ ...context, message: `File ${file} is a private key file` }]
    : [];
}

module.exports = (dependencies) => perFileDecorator(check, dependencies);
