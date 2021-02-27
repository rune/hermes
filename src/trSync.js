/*
Updates source files in Crowdin, pretranslates them using machine translation, then pulls
down the machine translations into each locale folder.
*/

const { languageData, projectData } = require("../lib/constants")
const updateSourceFiles = require("../lib/updateSourceFiles")
const machineTrFiles = require("../lib/machineTrFiles")
const repeatTaskInParallel = require("../lib/repeatTaskInParallel")
const downloadFile = require("../lib/downloadFile")

const trSync = async ({ filePaths, projectName }) => {
  // Check that project name is valid
  if (!Object.keys(projectData).includes(projectName)) {
    throw new Error(
      `${projectName} is an invalid project name. Please check hermes library.`
    )
  }

  // Check file paths are po files
  for (const filePath of filePaths) {
    if (!filePath.includes(".po")) throw new Error(`${filePath} is not a .po file.`)
  }

  const languageIds = Object.keys(languageData)
  // Update all specified files
  await updateSourceFiles({ filePaths, projectName })

  // Machine translate into all languages
  await machineTrFiles({ filePaths, languageIds, projectName })

  // Initialize all language x file combos that need to be downloaded
  const downloadFileArgs = filePaths
    .map(enFilePath => {
      return languageIds.map(languageId => {
        const filePath = enFilePath.replace(
          "/en/",
          `/${languageData[languageId].iso6391code}/`
        )
        return { filePath, languageId, projectName }
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
