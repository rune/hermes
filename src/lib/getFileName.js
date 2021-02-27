// Returns file name with its extension
// e.g. getFileName("test/en/test.json") -> "test.json"

const getFileName = filePath => {
  return filePath.split("/").pop()
}

module.exports = getFileName
