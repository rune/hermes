// Submits a single request to Crowdin to export one specified file
// in a specified language to be downloaded to a file path.

const { existsSync, mkdirSync } = require("fs")
const getPathToDir = require("./getPathToDir")
const getFileName = require("./getFileName")

const { getProjectId } = require("./crowdin/getProjectId")
const { getFileId } = require("./crowdin/getFileId")
const { getExportDownloadUrl } = require("./crowdin/getExportDownloadUrl")
const { execPromise } = require("./execPromise")

const downloadFile = async ({ filePath, languageCode, crowdinInfo }) => {
  const pathToDir = getPathToDir(filePath)
  const fileName = getFileName(filePath)

  const projectId = await getProjectId(crowdinInfo.apiV2Key, crowdinInfo.projectName)
  const fileId = await getFileId(crowdinInfo.apiV2Key, projectId, fileName)
  const downloadUrl = await getExportDownloadUrl(
    crowdinInfo.apiV2Key,
    projectId,
    languageCode,
    fileId
  )

  // if locale directory doesn't exist, create it
  if (!existsSync(pathToDir)) {
    mkdirSync(pathToDir, { recursive: true })
    console.log(`Created ${pathToDir}`)
  }

  await execPromise(`curl "${downloadUrl}" -o ${filePath}`)
  console.log(`Completed downloading ${fileName} into ${pathToDir}`)
}

module.exports = downloadFile
