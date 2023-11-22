const { getFileId } = require("./getFileId")
const { UploadStorage, SourceFiles } = require("@crowdin/crowdin-api-client")

async function uploadFile(token, fileName, content, projectId) {
  const storageId = await new UploadStorage({ token })
    .addStorage(fileName, content)
    .then(resp => resp.data.id)

  const fileId = await getFileId(token, projectId, fileName)

  await new SourceFiles({ token }).updateOrRestoreFile(projectId, fileId, { storageId })
}

module.exports = { uploadFile }
