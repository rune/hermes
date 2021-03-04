// Makes a duplicate copy of given file paths in the same folder, appending _original to
// the filename.

const fs = require("fs")

const copyFiles = filePaths => {
  for (const filePath of filePaths) {
    const extensionPeriodIndex = filePath.lastIndexOf(".")
    const newFilePath = `${filePath.substring(
      0,
      extensionPeriodIndex
    )}_original${filePath.substring(extensionPeriodIndex)}`

    fs.copyFile(filePath, newFilePath, err => {
      if (err) throw err
    })
  }
}

module.exports = copyFiles
