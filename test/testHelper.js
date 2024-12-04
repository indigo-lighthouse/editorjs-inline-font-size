const { screen, buildQueries } = require('@testing-library/dom')

const queryAllByCssSelector = function (container, selector) {
  return Array.from(container.querySelectorAll(selector))
}

const getMultipleError = (_, selector) => `Found multiple elements matching the CSS selector: ${selector}`
const getMissingError = (_, selector) => `Unable to find any elements matching the CSS selector: ${selector}`

const [queryByCssSelector, getAllByCssSelector, getByCssSelector, findAllByCssSelector, findByCssSelector] =
  buildQueries(queryAllByCssSelector, getMultipleError, getMissingError)

screen.queryByCssSelector = (selector) => queryByCssSelector(document.body, selector)
screen.getAllByCssSelector = (selector) => getAllByCssSelector(document.body, selector)
screen.getByCssSelector = (selector) => getByCssSelector(document.body, selector)
screen.findAllByCssSelector = (selector) => findAllByCssSelector(document.body, selector)
screen.findByCssSelector = (selector) => findByCssSelector(document.body, selector)

// It's unfortunate that dom-testing-library has chosen `screen` for its api entry point, because
// `screen` falls back to `window.screen` if not present. Hence sticking to `page`.
const page = screen

module.exports = { page }
