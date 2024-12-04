const assert = require('assert')
const { fireEvent } = require('@testing-library/dom')
const { userEvent } = require('@testing-library/user-event')
const { page } = require('./testHelper.js')
const EditorJS = require('@editorjs/editorjs')
const FontSizeTool = require('../index.js')

function selectWord() {
  const range = document.createRange()
  const paragraph = document.querySelector('.ce-paragraph')
  const textNode = paragraph.childNodes[0]
  range.setStart(textNode, 5)
  range.setEnd(textNode, 12)
  const selection = window.getSelection()
  selection.removeAllRanges()
  selection.addRange(range)
}

describe('editorjs-inline-font-size', function() {
  beforeEach(async function() {
    document.body.innerHTML = '<style>.u-font24 { font-size: 24px; }</style><div id="editorjs"></div>'

    this.editor = new EditorJS({
      holder: 'editorjs',
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
      },
      data: {
        blocks: [
          {
            id: 1,
            type: 'paragraph',
            data: {
              text: 'test bananas go wild',
            },
          },
        ],
      }
    })

    user = userEvent.setup()

    await this.editor.isReady
  })

  it('changes font size of selected text', async function() {
    // Given there is no text with size 24
    assert.ok(!document.querySelector('.u-font24'))

    // When I select a word
    selectWord()

    // And click font size icon in the inline toolbar
    await user.click(await page.findByCssSelector('#fontSizeBtn'))

    // And choose font size 24
    fireEvent.click(await page.findByText('24'))

    // Then the selected text size becomes 24
    const affectedNode = await page.findByCssSelector('.u-font24')
    assert.equal(affectedNode.innerText, 'bananas')

    // And the font size icon shows current font size 24
    assert.equal((await page.findByCssSelector('#fontSizeBtn')).innerText, '24')
  })
})
