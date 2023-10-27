## BACKGROUND

Since Chrome extensions can only load local files, devServer hot reload does not work (only the browser can be reloaded or the scripts can be re-executed remotely). We need to use scripts to make it reload automatically, which contains the `background` and `content-script` modules.
