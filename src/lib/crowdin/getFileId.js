const { SourceFiles } = require("@crowdin/crowdin-api-client")

const cache = new Map()

function getFileId(token, projectId, name) {
  const key = `${projectId}:${name}`

  if (!cache.has(key)) {
    cache.set(
      key,
      new SourceFiles({ token })
        .withFetchAll()
        .listProjectFiles(projectId)
        .then(resp => resp.data.find(file => file.data.path === `/${name}`))
        .then(file => {
          if (!file) throw new Error("File not found")
          return file.data.id
        })
    )
  }

  return cache.get(key)
}

module.exports = { getFileId }
