import util from "util"
import { exec } from "child_process"

module.exports.execPromise = util.promisify(exec)
