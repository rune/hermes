const { Translations } = require("@crowdin/crowdin-api-client")

function getPreTranslationStatus(token, projectId, identifier) {
  return new Translations({ token })
    .preTranslationStatus(projectId, identifier)
    .then(resp => resp.data)
}

module.exports = { getPreTranslationStatus }
