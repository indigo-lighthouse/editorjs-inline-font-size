![](https://badgen.net/badge/Editor.js/v2.0/blue)

# Font Size tool

Font size inline tool for the [Editor.js](https://editorjs.io).

## Installation

Get the package

```shell
npm add github:indigo-lighthouse/editorjs-inline-font-size
```

## Usage

Include module in your application

```javascript
const FontSizeTool = require('editorjs-inline-font-size-tool');
```

Add a new Tool to the `tools` property of the Editor.js initial config.

```javascript
const editor = EditorJS({
  ...
  
  tools: {
    ...
    fontSize: FontSizeTool
  }
  ...
});
```
