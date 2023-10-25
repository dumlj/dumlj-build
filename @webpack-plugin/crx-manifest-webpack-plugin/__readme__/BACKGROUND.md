## BACKGROUND

`Google Chrome Extension` uses [manifest.json](https://developer.chrome.com/docs/extensions/mv3/manifest/) to configure project. When we use webpack to build, the result file path is not consistent with the source, So we can use `Entry` to find all dependency files and add them to `manifest.json`.
