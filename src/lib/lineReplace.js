const { readFileSync, writeFileSync } = require("fs")

const lineReplace = ({ file, line, text }) => {
  const fileLines = readFileSync(file)
    .toString()
    .split("\n")

  fileLines[line] = text

  writeFileSync(file, fileLines.join("\n"))
}

module.exports = lineReplace
