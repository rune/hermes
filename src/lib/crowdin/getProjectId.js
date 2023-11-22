const { ProjectsGroups } = require("@crowdin/crowdin-api-client")

const cache = new Map()

function getProjectId(token, identifier) {
  const key = identifier

  if (!cache.has(key)) {
    cache.set(
      key,
      new ProjectsGroups({ token })
        .withFetchAll()
        .listProjects()
        .then(resp => resp.data.find(project => project.data.identifier === identifier))
        .then(project => {
          if (!project) throw new Error("Project not found")
          return project.data.id
        })
    )
  }

  return cache.get(key)
}

module.exports = { getProjectId }
