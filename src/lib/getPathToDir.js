// Return filepath excluding file name and extension.
// e.g. getPathToDir("test/en/test.json") -> "test/en/"

const getPathToDir = filePath => {
  return filePath.substring(0, filePath.lastIndexOf("/") + 1)
}

module.exports = getPathToDir
