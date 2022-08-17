/*
Updates source files in Crowdin, pretranslates them using machine translation, then pulls
down the machine translations into each locale folder.
*/

const updateSourceFiles = require("./lib/updateSourceFiles")
const machineTrFiles = require("./lib/machineTrFiles")
const repeatTaskInParallel = require("./lib/repeatTaskInParallel")
const downloadFile = require("./lib/downloadFile")
const preprocess = require("./lib/preprocess")
const postprocess = require("./lib/postprocess")

const trSync = async ({ filePaths, crowdinInfo, languageData, processables = null }) => {
  // Prevent running script for English
  delete languageData["3"]

  if (processables) {
    // Process any strings to be translated if necessary
    await preprocess(filePaths, processables)
  }

  const languageIds = Object.keys(languageData)
  // Update all specified files
  await updateSourceFiles({ filePaths, crowdinInfo })

  // Machine translate into all languages
  await machineTrFiles({ filePaths, languageData, crowdinInfo })

  // Initialize all language x file combos that need to be downloaded
  const downloadFileArgs = filePaths
    .map(enFilePath => {
      return languageIds.map(languageId => {
        const filePath = enFilePath.replace(
          "/en/",
          `/${languageData[languageId].iso6391code}/`
        )
        return {
          filePath,
          languageCode: languageData[languageId].crowdinLocaleCode,
          crowdinInfo
        }
      })
    })
    .reduce((acc, currentValue) => {
      return acc.concat(currentValue)
    }, [])

  // Download each file to their respective file paths. Note: Crowdin can only accept 20 concurrent requests.
  // However, since we are using deprecated API v1, the limit is decreased.
  await repeatTaskInParallel({
    // TODO: Change it back to 20 after updating to API v2
    concurrentLimit: 1,
    taskArgs: downloadFileArgs,
    processorFn: downloadFile
  })

  if (processables) {
    // Go through all language files and replace original string as `msgid` and remove the
    // copy files.
    await postprocess(filePaths, languageData)
  }
}

module.exports = trSync
