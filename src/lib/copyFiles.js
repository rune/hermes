// Makes a duplicate copy of given file paths in the same folder, appending _original to
// the filename.

const { copyFileSync } = require("fs")

const copyFiles = filePaths => {
  for (const filePath of filePaths) {
    const extensionPeriodIndex = filePath.lastIndexOf(".")
    const newFilePath = `${filePath.substring(
      0,
      extensionPeriodIndex
    )}_original${filePath.substring(extensionPeriodIndex)}`

    copyFileSync(filePath, newFilePath)
  }
}

module.exports = copyFiles
