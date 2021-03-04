#### Usage

Hermes provides utility functions that help automate the machine translation workflow. It doesn't perform any extraction for strings to be translated, handle resolving human & machine translations, nor logic for when files should be committed.

```
const trSync = require("@runeai/hermes")

;(async function() {
  await trSync({
    "languageData": {
      "15": { "iso6391code": "zh", "crowdinLocaleCode": "zh-CN" },
      "17": { "iso6391code": "es", "crowdinLocaleCode": "es-ES" },
      "22": { "iso6391code": "ru", "crowdinLocaleCode": "ru" },
    },
    "filePaths": ["translations/en/messages.po"],
    "crowdinInfo": {
      "projectName": "superawesomeproject",
      "apiKey": "xxxxxxxxx"
    },
    "processables": [
      { "phrase": "Friend Boost", "processor": "lowercase" },
      { "phrase": "Quick Match", "processor": "lowercase" }
    ]
  })
})()
```

#### How it works

1. The function will first create a copy of the provided file paths. This is the source of truth to help ensure integrity of original strings after the processing step.
2. If `processables` are provided, the function will match the `phrase` in any locale files and process it by one of the predetermined processors (see list below).
3. Update the source file in Crowdin, so any strings added/modified will be there ready to be translated.
4. Next, it'll machine translate the files using Google translate into the specified locales in the `languageData` payload when invoked.
5. When translations are done, the function will download all files into their respective locale folder, based on the language's ISO 639-1 code.
6. Finally, it'll replace all message strings to the original and clean up any of the copies made in the first step.

#### Existing list of processors

`lowercase` - lowercases the entire string
...more to come!
