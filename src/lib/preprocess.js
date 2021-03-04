// Apply predetermined processors to process any matching phrases

const fs = require("fs")

const processorList = {
  lowercase: str => {
    return str.toLowerCase()
  }
}

const preprocess = async (filePaths, processables) => {
  console.log("\nStarting preprocessing...")
  for (const filePath of filePaths) {
    let data = fs.readFileSync(filePath).toString()

    processables.forEach(({ phrase, processor }) => {
      if (!phrase) throw "Missing phrase!"

      const processorFn = processorList[processor]
      if (!processorFn) throw "Missing/invalid processor!"

      data = data.replace(new RegExp(phrase, "g"), processorFn(phrase))
    })

    fs.writeFileSync(filePath, data)
  }
  console.log("Finished preprocessing.\n")
}

module.exports = preprocess
