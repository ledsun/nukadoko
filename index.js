const denodeify = require('denodeify')
const fs = require('fs')
const remark = require('remark');
const findAllAfter = require('unist-util-find-all-after')
const remove = require('unist-util-remove')
const filter = require('unist-util-filter')
const findAllBefore = require('unist-util-find-all-before')

const ROTATE_SIZE = 12
const PRIMARY = process.argv[2]
const SECONDARY = process.argv[3]

const getTitle = remark().use(() => (ast) => ast.children = findAllBefore(ast, getH2(ast)[0]).reverse())
const getTestCase = remark().use(findTestCase)
const getOlderTestCase = remark()
  .use(findTestCase)
  .use(getOlder)
const getYangerTestCase = remark()
  .use(findTestCase)
  .use(getYanger)

denodeify(fs.readFile)(PRIMARY)
  .then((uat) => denodeify(fs.readFile)(SECONDARY)
    .then((uuat) => Promise.resolve({
      uuat,
      uat
    }))
  )
  .then(({
    uuat,
    uat
  }) => {
    let [target, source] = [uat, uuat]

    const ast = getTitle.run(getAST(target))
    ast.children = ast.children.concat(
      getOlderTestCase.run(getAST(source)).children,
      getYangerTestCase.run(getAST(target)).children
    )

    const md = remark.stringify(ast)
    console.log(md);
  })

function getAST(buf) {
  return remark.parse(buf.toString())
}

function findTestCase() {
  return (ast) => ast.children = findAllAfter(ast, ast.children.indexOf(getH2(ast)[0]) - 1)
}

function getOlder() {
  return function(ast) {
    const h2 = getH2(ast)
    ast.children = findAllAfter(ast, ast.children.indexOf(h2[h2.length - ROTATE_SIZE]) - 1)
  }
}

function getYanger() {
  return function(ast) {
    const h2 = getH2(ast)
    ast.children = findAllBefore(ast, h2[h2.length - ROTATE_SIZE]).reverse()
  }
}

function getH2(ast) {
  return ast.children.filter((node) => node.type === 'heading' && node.depth === 2)
}
