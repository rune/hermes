import { Translations } from "@crowdin/crowdin-api-client"

export function applyPreTranslation(token, projectId, languageIds, fileIds, engineId) {
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
