// Go through all language files and replace original string as `msgid` and remove the
// copy files.

const fs = require("fs")
const lineReplace = require("./lineReplace")

const postprocess = async (filePaths, languageData) => {
  console.log("\nStarting postprocessing...")
  const languageCodes = Object.values(languageData)
  for (const enFilePath of filePaths) {
    const extensionPeriodIndex = enFilePath.lastIndexOf(".")
    const originalFilePath = `${enFilePath.substring(
      0,
      extensionPeriodIndex
    )}_original${enFilePath.substring(extensionPeriodIndex)}`

    const allLocaleFilePaths = languageCodes
      .map(languageCode => {
        const filePath = enFilePath.replace("/en/", `/${languageCode.iso6391code}/`)
        return filePath
      })
      .reduce(
        (acc, currentValue) => {
          return acc.concat(currentValue)
        },
        [enFilePath]
      )

    // Init array of lines in the original file
    const enFileLines = fs
      .readFileSync(originalFilePath)
      .toString()
      .split("\n")

    // Init indicies of lines that start with `msgid`
    const enMsgIdIndices = []
    enFileLines.forEach((line, idx) => {
      if (line.startsWith("msgid")) enMsgIdIndices.push(idx)
    })

    // Remove the first msgid index since it's just a .po file standard
    enMsgIdIndices.shift()

    // For each locale file, replace with the original English string
    for (const localeFilePath of allLocaleFilePaths) {
      if (localeFilePath.includes("/en/")) {
        enMsgIdIndices.forEach(index => {
          lineReplace({
            file: localeFilePath,
            line: index,
            text: enFileLines[index]
          })
        })
      } else {
        // Crowdin can sometimes add additional metadata lines to MT files so we'll need
        // the proper index diff offset to replace all lines with `msgid`
        const localeFileLines = fs
          .readFileSync(localeFilePath)
          .toString()
          .split("\n")

        let idxDiff
        let lineIdx = 0
        let msgidCount = 0
        for (const localeFileLine of localeFileLines) {
          if (localeFileLine.startsWith("msgid")) {
            msgidCount++
            if (msgidCount === 2) {
              idxDiff = lineIdx - enMsgIdIndices[0]
              break
            }
          }
          lineIdx++
        }

        enMsgIdIndices.forEach(index => {
          lineReplace({
            file: localeFilePath,
            line: index + idxDiff,
            text: enFileLines[index]
          })
        })
      }
    }

    // Remove the original file since it's no longer needed
    fs.unlinkSync(originalFilePath)
  }

  console.log("Finished postprocessing.\n")
}

module.exports = postprocess
