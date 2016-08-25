---
title: Application configuration with npm
collection: articles
layout: article.pug
date: 2015-02-21T23:00:00
draft: true
---

`npm(1)` has plenty of lesser-known features, including a
[built-in configuration tool][npm-conf]. It works by fetching
configuration options from npmrc files, and exporting them in
environment variables to your program, [12-factor style][12].

## Setting config options

The basic commands are:

    $ npm config get <key>
    $ npm config set <key> <value>
    $ npm config delete <key>
    $ npm config list

You can also use the shorthand commands `npm set` and `npm get`.

When npm looks for a config option it will look in these files in
order of preference:

- local (/path/to/program/.npmrc)
- user (~/.npmrc)
- global (/etc/npmrc)
- builtin (/path/to/npm/npmrc)

When you set a config option, the value is stored in the local
`.npmrc` file if present, or at `~/.npmrc`.

## Setting defaults

If npm doesn't find an option in any npmrc, it will use the default.
To set defaults, add a `config` key to your `package.json`:

    {
      "name": "www",
      "config": {
        "port": 1337,
        "pretty": true,
        "db": "localhost:27017"
      }
    }

npm will use these default values for your options, unless
you override them with `npm set`.

## Using config options

Start your program with `npm start` and its settings will
be exposed as environment variables. These will be named like
`npm_package_config_port` for the `port` setting.

You can set your defaults for local development, and use different
values in production. When you set your config options, prefix them
with the name of your program and a colon so npm knows which package
they are for:

    $ npm set www:port 8080
    $ npm set www:pretty false
    $ npm set www:db db.myhost.com:27017

If your program is started without `npm(1)`, you can fall back to
the defaults specified in your package.json:

```js
var pkg = require('./package.json')
var port = process.env.npm_package_config_port || pkg.config.port
```

You can also override the defaults by setting environment
variables yourself when you start it:

    $ npm_package_config_port=1234 bin/serve

In development, add .npmrc to your .gitignore and use ~/.npmrc.

Outside of development the local .npmrc should be owned and only
readable by the user that will run your program.

## Nicer usage

I use a little config utility to abstract the config source, and
so I can specify options as command-line switches for convenience:

```js
// lib/config.js

var args = require('minimist')(process.argv)
var pkg = require('../package.json')
var env = process.env

module.exports = function config (key) {
  let ekey = 'npm_package_config_'+key
  if (key in args) return args[key]
  return (ekey in env) ? env[ekey] : pkg.config[key]
}
```

Then, I can refer to my configuration easily:

```js
var config = require('./config')
app.listen(config('port'))
```

[retsly]:https://rets.ly
[12]:https://12factor.net
[unix]:https://en.wikipedia.org/wiki/Unix_philosophy
[npm-conf]:https://docs.npmjs.com/misc/config
[npm-script]:https://docs.npmjs.com/cli/run-script
