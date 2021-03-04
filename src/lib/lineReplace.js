const fs = require("fs")

const lineReplace = ({ file, line, text }) => {
  const fileLines = fs
    .readFileSync(file)
    .toString()
    .split("\n")

  fileLines[line] = text

  fs.writeFileSync(file, fileLines.join("\n"))
}

module.exports = lineReplace
