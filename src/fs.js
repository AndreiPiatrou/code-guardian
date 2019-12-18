const fs = require('fs');
const path = require('path');
const readDir = require('fs-readdir-recursive');
const ignore = require('ignore')();

function getFiles(dirPath, excludes) {
  const filesMatcher = ignore.add(excludes);

  const relativeFiles = readDir(dirPath, (name, _index, dir) => {
    const fullPath = path.join(dir, name);
    const relativePath = path.relative(dirPath, fullPath);

    return !filesMatcher.ignores(relativePath);
  });

  return relativeFiles.map((relative) => path.resolve(dirPath, relative));
}

function readLines(filePath) {
  return fs.readFileSync(filePath, 'utf8').split('\n');
}

// TODO: implement a cached.fs.decorator that will cache:
// 1. the list of files of the last directory
// 2. the list of lines of the last file
module.exports = {
  getFiles,
  readLines,
};
