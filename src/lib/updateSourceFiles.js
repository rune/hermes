// Submits a single request to Crowdin that updates specified English origin files to be
// ready for machine translation.
// Note: 20 files max are allowed to upload per one time file transfer. Any already
// updated files will respond successfully with skipped status.

const FormData = require("form-data")
const fetch = require("node-fetch")
const { createReadStream, existsSync } = require("fs")
const isEnglishFile = require("./isEnglishFile")
const getFileName = require("./getFileName")

const updateSourceFiles = async ({ filePaths, crowdinInfo }) => {
  console.log(`Updating ${JSON.stringify(filePaths)}...`)
  //set up request options
  const form = new FormData()
  for (const filePath of filePaths) {
    // check to make sure each file exists and is in English
    if (!isEnglishFile(filePath))
      throw `Cannot upload a non-English file from ${filePath}!`
    if (!existsSync(filePath)) throw `Cannot upload a non-existent file from ${filePath}!`

    const fileName = getFileName(filePath)
    const stream = createReadStream(filePath)
    form.append(`files[${fileName}]`, stream)
  }
  const options = {
    method: "POST",
    body: form
  }

  // initiate request and expect XML response
  const response = await fetch(
    `https://api.crowdin.com/api/project/${crowdinInfo.projectName}/update-file?key=${crowdinInfo.apiKey}`,
    options
  )
  const formattedResponse = await response.text()

  return new Promise((resolve, reject) => {
    if (response.ok) {
      console.log(`Successfully completed updating files!\n`)
      resolve(formattedResponse)
    } else {
      console.log(`Error updating files!}\n`)
      reject(formattedResponse)
    }
  })
}

module.exports = updateSourceFiles
