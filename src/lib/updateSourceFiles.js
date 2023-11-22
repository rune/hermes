// Submits a single request to Crowdin that updates specified English origin files to be
// ready for machine translation.
// Note: 20 files max are allowed to upload per one time file transfer. Any already
// updated files will respond successfully with skipped status.

const { existsSync, readFileSync } = require("fs")
const isEnglishFile = require("./isEnglishFile")
const getFileName = require("./getFileName")
const { uploadFile } = require("./crowdin/uploadFile")
const { getProjectId } = require("./crowdin/getProjectId")

const updateSourceFiles = async ({ filePaths, crowdinInfo }) => {
  console.log(`Updating ${JSON.stringify(filePaths)}...`)

  const projectId = await getProjectId(crowdinInfo.apiV2Key, crowdinInfo.projectName)

  for (const filePath of filePaths) {
    // check to make sure each file exists and is in English
    if (!isEnglishFile(filePath))
      throw `Cannot upload a non-English file from ${filePath}!`
    if (!existsSync(filePath)) throw `Cannot upload a non-existent file from ${filePath}!`

    await uploadFile(
      crowdinInfo.apiV2Key,
      getFileName(filePath),
      readFileSync(filePath),
      projectId
    )
  }

  console.log(`Successfully completed updating files!`)
}

module.exports = updateSourceFiles
