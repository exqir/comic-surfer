const _glob = require('glob')
const { readFile, writeFile } = require('fs-extra')
const { promisify } = require('util')

const glob = promisify(_glob)

glob('**/*.@(root|server).graphql', { absolute: true }).then(files =>
  files.forEach(file => {
    readFile(file)
      .then(buffer => buffer.toString().replace(/ @[\w]*/g, ''))
      .then(cleaned =>
        writeFile(file.replace(/.server.graphql/, '.client.graphql'), cleaned),
      )
  }),
)
