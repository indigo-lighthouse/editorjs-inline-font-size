![](https://badgen.net/badge/Editor.js/v2.0/blue) [![Node.js CI](https://github.com/indigo-lighthouse/editorjs-inline-font-size/actions/workflows/node.js.yml/badge.svg)](https://github.com/indigo-lighthouse/editorjs-inline-font-size/actions/workflows/node.js.yml)

# Font Size tool

Font size inline tool for the [Editor.js](https://editorjs.io).

## Installation

Get the package

```shell
npm add github:indigo-lighthouse/editorjs-inline-font-size
```

## Usage

Add a new Tool to the `tools` property of the Editor.js initial config.

The specified `cssClass` classes need to be defined somewhere in your CSS for the text to actually change size.

```javascript
const FontSizeTool = require('editorjs-inline-font-size-tool');

const editor = EditorJS({
  tools: {
    fontSize: {
      class: FontSizeTool,
      config: {
        fontSizes: [
          {
            cssClass: 'u-font16',
            buttonText: '16',
          },
          {
            cssClass: 'u-font24',
            buttonText: '24',
          }
        ]
      },
    }
  }
});
```
