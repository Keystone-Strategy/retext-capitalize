const visit = require('unist-util-visit')
const is = require('unist-util-is')
const convert = require('unist-util-is/convert')
const toString = require('nlcst-to-string')
const _ = require('lodash')

const whiteSpace = convert('WhiteSpaceNode')

const isLowerCase = (char) =>
  char.toLowerCase() === char && char.toUpperCase() !== char

function attacher() {
  return transformer

  function transformer(tree, file) {
    function visitor(node) {
      const { children } = node
      children.forEach(child => {
        if (whiteSpace(child)) return
        const childStartColumn = _.get(child, 'position.start.column', null)
        const childFirstChar = _.head(toString(child))
        if (
          is(child, 'WordNode')
          && childStartColumn === 1
          && isLowerCase(childFirstChar)
        ) {
          file.message(
            `Expected "${childFirstChar}" in upper case to start this line`,
            child,
            'retext-capitalize:capitalize'
          )
        }
      })
    }

    visit(tree, 'SentenceNode', visitor)
  }
}

module.exports = attacher
