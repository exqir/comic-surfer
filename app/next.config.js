const withGraphql = require('next-plugin-graphql')
module.exports = withGraphql({
  webpack: config => {
    // Fixes npm packages that depend on `fs` module
    config.node = {
      fs: 'empty'
    }

    return config
  }
})
