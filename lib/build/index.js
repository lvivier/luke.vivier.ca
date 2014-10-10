
/**
 * Dependencies
 */

var resolve = require('component-resolver')
var build = require('component-builder')
var stylus = require('builder-stylus')
var write = require('fs').writeFileSync
var join = require('path').join
var mkdirp = require('mkdirp')


/**
 * Component builder
 */

module.exports = function (path, out, dev, done) {
  var next = times(3, done)
  resolve(path, {install:true}, function(err, tree){
    if (err) return done(err)

    mkdirp(out)

    build.scripts(tree, {sourceURL:dev})
      .use('scripts', build.plugins.js())
      .end(function (err, str) {
        if (err) throw err
        str = build.scripts.require + str + '\n\n;require("./lib/app")'
        write(join(out, 'build.js'), str)
        next()
      })

    build.styles(tree)
      .use('styles', stylus())
      .use('styles', build.plugins.urlRewriter())
      .end(function (err, str) {
        if (err) throw err
        write(join(out, 'build.css'), str)
        next()
      })

    build.files(tree, {destination:out})
      .use('images', build.plugins.copy())
      .use('fonts', build.plugins.copy())
      .use('files', build.plugins.copy())
      .end(next)
  })
}


/**
 * Call fn after n calls
 */

function times(n, fn){
  var calls = 0
  return function(){
    if (++calls===n) return fn()
  }
}
