// Submits a single request to Crowdin that runs their pre-translation feature to convert
// specified English files into other languages.
// Note: If requested languages are not specified in Crowdin project, response will still
// succeed with status of skipped.

const getFileName = require("./getFileName")
const { getProjectId } = require("./crowdin/getProjectId")
const { getFileId } = require("./crowdin/getFileId")
const { getEngineId } = require("./crowdin/getEngineId")
const { applyPreTranslation } = require("./crowdin/applyPreTranslation")
const { getPreTranslationStatus } = require("./crowdin/getPreTranslationStatus")
const { sleep } = require("./sleep")

const machineTrFiles = async ({ filePaths, languageData, crowdinInfo }) => {
  console.log(`Machine translating ${JSON.stringify(filePaths)}...`)

  const projectId = await getProjectId(crowdinInfo.apiV2Key, crowdinInfo.projectName)
  const languageIds = Object.values(languageData).map(
    ({ crowdinLocaleCode }) => crowdinLocaleCode
  )
  const fileIds = await Promise.all(
    filePaths.map(filePath =>
      getFileId(crowdinInfo.apiV2Key, projectId, getFileName(filePath))
    )
  )
  const engineId = await getEngineId(crowdinInfo.apiV2Key, "google")

  const preTranslationId = await applyPreTranslation(
    crowdinInfo.apiV2Key,
    projectId,
    languageIds,
    fileIds,
    engineId
  )

  const checkEveryMs = 1000
  const maxWaitMs = 120000 // 2 minutes

  for (let i = 0; i < maxWaitMs / checkEveryMs; i++) {
    await sleep(checkEveryMs)

    const { status, progress } = await getPreTranslationStatus(
      crowdinInfo.apiV2Key,
      projectId,
      preTranslationId
    )

    if (status === "finished") {
      console.log("Finished")
      return
    } else {
      console.log(`Progress: ${status} ${progress}`)
    }
  }

  throw new Error("Pre-translations timed out")
}

module.exports = machineTrFiles
