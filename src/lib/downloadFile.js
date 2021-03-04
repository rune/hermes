// Submits a single request to Crowdin to export one specified file
// in a specified language to be downloaded to a file path.

const fetch = require("node-fetch")
const { createWriteStream, existsSync, mkdirSync } = require("fs")
const getPathToDir = require("./getPathToDir")
const getFileName = require("./getFileName")

const downloadFile = async ({ filePath, languageCode, crowdinInfo }) => {
  const pathToDir = getPathToDir(filePath)
  const fileName = getFileName(filePath)

  // initiate request
  const response = await fetch(
    `https://api.crowdin.com/api/project/${crowdinInfo.projectName}/export-file?file=${fileName}&language=${languageCode}&key=${crowdinInfo.apiKey}`
  )

  // if locale directory doesn't exist, create it
  if (!existsSync(pathToDir)) {
    mkdirSync(pathToDir, { recursive: true })
    console.log(`Created ${pathToDir}`)
  }

  if (response.ok) {
    const fileStream = createWriteStream(filePath, { flag: "r+" })
    await new Promise((resolve, reject) => {
      response.body.pipe(fileStream)
      fileStream.on("finish", () => {
        console.log(`Completed downloading ${fileName} into ${pathToDir}`)
        resolve()
      })
      response.body.on("error", () => {
        console.log(`Error writing ${fileName} into ${pathToDir}`)
        reject()
      })
    })
  } else {
    const error = await response.text()
    await new Promise((resolve, reject) => {
      console.log(`Error getting ${fileName} from Crowdin in ${languageCode}`)
      reject(error)
    })
  }
}

module.exports = downloadFile
