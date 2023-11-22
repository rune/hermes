const { MachineTranslation } = require("@crowdin/crowdin-api-client")

const cache = new Map()

function getEngineId(token, name) {
  const key = name

  if (!cache.has(key)) {
    cache.set(
      key,
      new MachineTranslation({ token })
        .withFetchAll()
        .listMts()
        .then(resp => resp.data.find(engine => engine.data.name === name))
        .then(engine => {
          if (!engine) throw new Error("Engine not found")
          return engine.data.id
        })
    )
  }

  return cache.get(key)
}

module.exports = { getEngineId }
