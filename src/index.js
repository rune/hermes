/*
Updates source files in Crowdin, pretranslates them using machine translation, then pulls
down the machine translations into each locale folder.
*/

const updateSourceFiles = require("./lib/updateSourceFiles")
const machineTrFiles = require("./lib/machineTrFiles")
const repeatTaskInParallel = require("./lib/repeatTaskInParallel")
const downloadFile = require("./lib/downloadFile")

const trSync = async ({ filePaths, crowdinInfo, languageData }) => {
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

  // Download each file to their respective file paths. Note: Crowdin can only accept 20
  // concurrent requests.
  await repeatTaskInParallel({
    concurrentLimit: 20,
    taskArgs: downloadFileArgs,
    processorFn: downloadFile
  })
}

module.exports = trSync
