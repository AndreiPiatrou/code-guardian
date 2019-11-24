function write({
  file, line, lineNumber, message, checker,
}, { log, chalk: c }) {
  log(c.underline.white(file));
  log(`\t${c.red(checker)}\t${c.white(lineNumber)}:${c.italic.white(line)}\t${c.grey(message)}`);
}

module.exports = write;
