
/**
 * Dependencies
 */

var stylus = require('component-stylus-plugin')
var Builder = require('component-builder')
var write = require('fs').writeFileSync
var join = require('path').join
var nib = require('nib')


/**
 * Stylus
 */

stylus.plugins.push(nib())


/**
 * Component builder
 */

module.exports = function (path, out, dev, done) {
  var build = new Builder(path)

  if (dev) build.addSourceURLs()

  build.copyAssetsTo(out)

  build
    .use(stylus)
    .build(function(err, app) {
      if (err) return done(err)

      write(join(out, 'build.js'), app.require+app.js)
      write(join(out, 'build.css'), app.css)

      done()
    })
}
