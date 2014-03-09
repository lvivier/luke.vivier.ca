
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

  // copy w/o symlinks
  build.copyAssetsTo(out)
  build.copyFiles()

  build
    .use(stylus)
    .build(function(err, app) {
      if (err) return done(err)

      // automatically require app
      var js = app.require+app.js+';require("app")'

      write(join(out, 'build.js'), js)
      write(join(out, 'build.css'), app.css)

      done()
    })
}
