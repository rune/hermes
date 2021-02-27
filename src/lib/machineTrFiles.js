// Submits a single request to Crowdin that runs their pre-translation feature to convert
// specified English files into other languages.
// Note: If requested languages are not specified in Crowdin project, response will still
// succeed with status of skipped.

const FormData = require("form-data")
const fetch = require("node-fetch")
const getFileName = require("./getFileName")

const machineTrFiles = async ({ filePaths, languageData, crowdinInfo }) => {
  console.log(`Machine translating ${JSON.stringify(filePaths)}...`)
  //set up request options
  const form = new FormData()
  form.append("method", "mt")
  form.append("apply_untranslated_strings_only", "true")
  form.append("engine", "google")
  for (const filePath of filePaths) {
    const fileName = getFileName(filePath)
    form.append("files[]", fileName)
  }
  for (const languageId in languageData) {
    form.append("languages[]", languageData[languageId].crowdinLocaleCode)
  }

  // initiate request
  const response = await fetch(
    `https://api.crowdin.com/api/project/${crowdinInfo.projectName}/pre-translate?key=${crowdinInfo.apiKey}`,
    {
      method: "POST",
      body: form
    }
  )
  const formattedResponse = await response.text()

  return new Promise((resolve, reject) => {
    if (response.ok) {
      console.log(`Successfully completed machine translating files!\n`)
      resolve(formattedResponse)
    } else {
      console.log(`Error machine translating files!\n`)
      reject(formattedResponse)
    }
  })
}

module.exports = machineTrFiles
