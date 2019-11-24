function write({
  message, author, hash, commit, checker,
}, { log, color: c }) {
  log(`Commit hash: ${c.underline.white(hash)}`);
  log(`\t${c.red(checker)}\t${c.grey('author:')}${c.white(author)}\t${c.grey('message:')}${c.white(commit)}\t${c.grey(message)}`);
}

module.exports = write;
