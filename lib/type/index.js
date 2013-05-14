var typogr = require('typogr')

module.exports = function (text)
{
  return typogr
    .typogrify(
      text
        .replace(/(&quot;)/g, '\"')
        .replace(/(&#39;)/g, '\'')
    )
}
