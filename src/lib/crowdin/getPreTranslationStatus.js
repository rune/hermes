import { Translations } from "@crowdin/crowdin-api-client"

export function getPreTranslationStatus(token, projectId, identifier) {
  return new Translations({ token })
    .preTranslationStatus(projectId, identifier)
    .then(resp => resp.data)
}
