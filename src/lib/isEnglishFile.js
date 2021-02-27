// Returns boolean depending on filePath having '/en/' in it.
// e.g. isEnglishFile("test/en/test.json") -> true

const isEnglishFile = filePath => {
  return filePath.includes("/en/")
}

module.exports = isEnglishFile
