const fs = require('fs');
const path = require('path');
const readDir = require('fs-readdir-recursive');

// TODO: implement true wildcard for ignore list instead of simple `include` check
function getFiles(dirPath, excludes) {
  const relativeFiles = readDir(dirPath, (name, index, dir) => {
    const full = path.join(dir, name);

    return (excludes || []).every((exclude) => !full.includes(exclude));
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
