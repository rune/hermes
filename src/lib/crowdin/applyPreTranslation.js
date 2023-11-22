const { Translations } = require("@crowdin/crowdin-api-client")

function applyPreTranslation(token, projectId, languageIds, fileIds, engineId) {
  return new Translations({ token })
    .applyPreTranslation(projectId, {
      method: "mt",
      translateUntranslatedOnly: true,
      languageIds,
      fileIds,
      engineId
    })
    .then(resp => resp.data.identifier)
}

module.exports = { applyPreTranslation }
