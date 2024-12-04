function injectStyles(css) {
  const style = document.createElement('style')
  style.appendChild(document.createTextNode(css))
  document.head.appendChild(style)
}

let css = `
.ce-popover--inline .ce-popover__container {
  overflow: visible;
}

.ce-inline-tool.ce-inline-tool--font {
  display: flex;
}

.ce-inline-tool .selectionList {
  position: absolute;
  top: 35px;
}

.ce-inline-tool .selectionList .selection-list-wrapper {
  width: 50px;
  background: #fff;
  border: 1px solid #eaeaea;
}

.ce-inline-tool .selectionList .selection-list-wrapper .selection-list-option {
  padding-top: 5px;
  padding-bottom: 5px;
  border-bottom: 1px solid #eaeaea;
}

.ce-inline-tool .selectionList .selection-list-wrapper .selection-list-option-active {
  background-color: #eff2f5;
}

.ce-inline-tool .selectionList .selection-list-wrapper .selection-list-option:hover {
  background-color: #eff2f5;
}
`

injectStyles(css)

class FontSizeTool {
  static title = 'Font Size'
  isDropDownOpen = false
  emptyString = '&nbsp&nbsp'
  fontSizeDropDown = 'font-size-dropdown'

  static get sanitize() {
    return {
      font: {
        size: true,
        face: true
      },
    }
  }
  static get isInline() {
    return true
  }

  commandName = 'fontSize'

  CSS = {
    button: 'ce-inline-tool',
    buttonActive: 'ce-font-size-tool--active',
    buttonModifier: 'ce-inline-tool--font',
  }

  nodes = {
    button: undefined
  }
  selectedFontSize = null

  selectionList = undefined

  buttonWrapperText = undefined

  tag = 'SPAN'

  constructor({ api, config }) {
    this.api = api
    this.config = config
  }

  make(tagName, classNames = null) {
    const el = document.createElement(tagName)

    if (Array.isArray(classNames)) {
      el.classList.add(...classNames)
    } else if (classNames) {
      el.classList.add(classNames)
    }
    return el
  }

  createButton() {
    this.nodes.button = this.make('button', [this.CSS.button, this.CSS.buttonModifier])
    this.nodes.button.type = 'button'
    this.nodes.button.setAttribute('id', 'fontSizeBtn')
    this.getFontSizeForButton()
  }

  getFontSizeForButton() {
    this.buttonWrapperText = this.make('div', 'button-wrapper-text')
    const displaySelectedFontSize = this.make('div')
    displaySelectedFontSize.setAttribute('id', this.fontSizeDropDown)
    displaySelectedFontSize.innerHTML = this.emptyString
    this.buttonWrapperText.append(displaySelectedFontSize)
    this.nodes.button.append(this.buttonWrapperText)
  }

  addFontSizeOptions() {
    this.selectionList = this.make('div', 'selectionList')
    const selectionListWrapper = this.make('div', 'selection-list-wrapper')

    for (const { cssClass, buttonText } of this.config.fontSizes) {
      const option = this.make('option')
      option.setAttribute('value', cssClass)
      option.classList.add('selection-list-option')
      if ((this.nodes.button.querySelector('#' + this.fontSizeDropDown).innerHTML === buttonText) || (this.selectedFontSize === cssClass)) {
        option.classList.add('selection-list-option-active')
      }
      option.innerHTML = buttonText
      selectionListWrapper.append(option)
    }
    this.selectionList.append(selectionListWrapper)
    this.nodes.button.append(this.selectionList)
    this.selectionList.addEventListener('click', this.toggleFontSizeSelector.bind(this))
  }

  toggleFontSizeSelector(event) {
    this.selectedFontSize = event.target.value
    this.toggle()
  }

  removeFontSizeOptions() {
    if (this.selectionList) {
      this.selectionList = this.selectionList.remove()
    }
  }

  render() {
    this.createButton()
    this.nodes.button.addEventListener('click', this.toggleDropDown.bind(this))
    return this.nodes.button
  }

  toggleDropDown(event) {
    if (((event.target).id === this.fontSizeDropDown || event.target.parentNode.id === 'fontSizeBtn' || event.target.id === 'fontSizeBtn')) {
      this.toggle()
    }
  }

  toggle() {
    if (!this.isDropDownOpen) {
      this.isDropDownOpen = true
      this.addFontSizeOptions()
    } else {
      this.isDropDownOpen = false
      this.removeFontSizeOptions()
    }
  }

  #findWrapNode(cssClass) {
    const wrapNode = this.api.selection.findParentTag(this.tag, cssClass)

    const sel = window.getSelection()

    if (wrapNode && sel.toString() == wrapNode.innerText) {
      return wrapNode
    }
  }

  surround(range) {
    if (range && this.selectedFontSize) {
      const cssClass = this.selectedFontSize

      const wrapNode = this.#findWrapNode(cssClass)

      if (wrapNode) {
        this.unwrap(range, wrapNode)
      } else {
        for (const { cssClass } of this.config.fontSizes) {
          const wrapNode = this.#findWrapNode(cssClass)

          if (wrapNode) {
            this.unwrap(range, wrapNode)
          }
        }

        this.wrap(range, cssClass)
      }
    }
  }

  wrap(range, cssClass) {
    const span = document.createElement(this.tag);

    span.classList.add(cssClass)

    const fragment = this.#removeEnclosedFontSizeTags(range)

    span.appendChild(fragment);
    range.insertNode(span);

    this.api.selection.expandToTag(span);
  }

  #removeEnclosedFontSizeTags(range) {
    const fragment = document.createDocumentFragment()
    const rangeContents = range.extractContents()
    const fontSizeClasses = this.config.fontSizes.map(({ cssClass }) => cssClass)

    Array.from(rangeContents.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE && fontSizeClasses.includes(node.className)) {
        while (node.firstChild) {
          // appendChild also removes node.firstChild, so that the next iteration points to the next child.
          fragment.appendChild(node.firstChild)
        }
      } else {
        fragment.appendChild(node)
      }
    })
    return fragment
  }

  unwrap(range, wrapNode) {
    this.api.selection.expandToTag(wrapNode);

    const sel = window.getSelection();

    const unwrappedContent = range.extractContents();

    wrapNode.parentNode.removeChild(wrapNode);

    range.insertNode(unwrappedContent);

    /**
     * Restore selection
     */
    sel.removeAllRanges();
    sel.addRange(range);
  }

  #getComputedFontStyle(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      return window.getComputedStyle(node.parentNode, null).getPropertyValue('font-size')
    } else {
      return window.getComputedStyle(node, null).getPropertyValue('font-size')
    }
  }

  checkState(selection) {
    const { anchorNode, focusNode } = selection
    const range = selection.getRangeAt(0)
    let computedFontSize = this.emptyString

    // text is selected within another text
    if (anchorNode === focusNode) {
      computedFontSize = this.#getComputedFontStyle(anchorNode)

    // an element is selected (e.g. double click on a word that has different font size than its surroundings)
    } else if (anchorNode.length === range.startOffset && range.endOffset === 0) {
      const selectedNode = anchorNode.nextSibling

      computedFontSize = this.#getComputedFontStyle(selectedNode)
    }

    const displaySelectedFontSize = this.nodes.button.querySelector('#' + this.fontSizeDropDown)
    displaySelectedFontSize.innerHTML = computedFontSize.replace(/(\.\d*)?px/, '')
  }

  clear() {
    this.toggle()
    this.selectedFontSize = null
  }
}

module.exports = FontSizeTool
