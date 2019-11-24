function write({
  file, line, lineNumber, message, checker,
}, { log, color: c }) {
  log(c.underline.white(file));
  log(`\t${c.red(checker)}\t${c.grey(lineNumber)}:${c.white(line)}\t${c.grey(message)}`);
}

module.exports = write;
