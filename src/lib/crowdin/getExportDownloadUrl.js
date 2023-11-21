const { Translations } = require("@crowdin/crowdin-api-client")

function getExportDownloadUrl(token, projectId, languageCode, fileId) {
  return new Translations({ token })
    .exportProjectTranslation(projectId, {
      targetLanguageId: languageCode,
      fileIds: [fileId]
    })
    .then(resp => resp.data.url)
}

module.exports = { getExportDownloadUrl }
