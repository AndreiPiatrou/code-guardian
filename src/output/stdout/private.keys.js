function write({
  file, message, checker,
}, { log, chalk: c }) {
  log(c.underline.white(file));
  log(`\t${c.red(checker)}:\t${c.grey(message)}`);
}

module.exports = write;
