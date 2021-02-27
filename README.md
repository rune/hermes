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
    }
  })
})()
```

#### How it works

1. The function will first update the source file in Crowdin, so any strings added/modified will be there ready to be translated.
2. Next, it'll machine translate the files using Google translate into the specified locales in the `languageData` payload when invoked.
3. When translations are done, the function will download all files into their respective locale folder, based on the language's ISO 639-1 code.
