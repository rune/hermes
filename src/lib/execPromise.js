const util = require("util")
const { exec } = require("child_process")

module.exports.execPromise = util.promisify(exec)
