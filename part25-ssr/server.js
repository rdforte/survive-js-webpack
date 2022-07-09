const express = require('express')
const { renderToString } = require('react-dom/server')
const SSR = require('./static')

const app = express()

app.use(express.static('static'))

app.get('/', (_req, res) => {
	res.status(200).send(renderMarkup(renderToString(SSR)))
})

app.listen(process.env.PORT || 8080)

function renderMarkup(html) {
	return `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <div id="app">${html}</div>
  <script src="./index.js"></script>
</body>
</html>
  `
}

/**
 * NOTES:
 * the request will hit app.get in which case we serve up the html with the ssr code in it.
 * in the html code we have a script tag which references source and because we are
 * using the express static middleware which references the static assets the client will
 * then go and fetch the index.js file.
 */
