const fs = require("fs")
const path = require("path")
const LRU = require("lru-cache")
const bodyParser = require("body-parser")
const express = require("express")
const favicon = require("serve-favicon")
const compression = require("compression")
const resolve = file => path.resolve(__dirname, file)
const { createBundleRenderer } = require("vue-server-renderer")

const isProd = process.env.NODE_ENV === "production"
const serverInfo =
	`express/${require('express/package.json').version} ` +
	`vue-server-renderer/${require('vue-server-renderer/package.json').version}`

const app = express()

function createRenderer(bundle, options) {
	return createBundleRenderer(bundle, Object.assign(options, {
		cache: LRU({
			max: 1000,
			maxAge: 1000 * 60 * 15
		}),
		basedir: resolve("./dist"),
		runInNewContext: false
	}))
}

let renderer
let readyPromise
const templatePath = resolve("./src/index.template.html")
if(isProd) {
	const template = fs.readFileSync(templatePath, "utf-8")
	const bundle = require("./dist/vue-ssr-server-bundle.json")
	const clientManifest = require("./dist/vue-ssr-client-manifest.json")
	renderer = createRenderer(bundle, {
		template,
		clientManifest
	})
} else {
	readyPromise = require("./build/setup-dev-server")(
		app,
		templatePath,
		(bundle, options) => {
			renderer = createRenderer(bundle, options)
		}
	)
}

// express.static 中间件函数 在express中提供静态文件
const serve = (path, cache) => express.static(resolve(path), {
	maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0
})

// 这个方法返回一个仅仅用来解析json格式的中间件。这个中间件能接受任何body中任何Unicode编码的字符。支持自动的解析gzip和 zlib。
app.use(bodyParser.json())
// 这个方法也返回一个中间件，这个中间件用来解析body中的urlencoded字符，只支持utf-8的编码的字符。同样也支持自动的解析gzip和 zlib。
app.use(bodyParser.urlencoded({ extended: false }));

app.use(compression({ threshold: 0 }))
// app.use(favicon("./public/favicon.ico"))
// app.use(favicon("./public/logo-48.png"))
app.use(serve("./dist", true))
app.use(serve("./dist/manifest.json", true))

function render(req, res) {
	const s = Date.now()

	res.setHeader("Content-Type", "text/html")
	res.setHeader("Server", serverInfo)

	const handleError = err => {
		if (err.url) {
			res.redirect(err.url)
		} else if (err.code === 404) {
			res.status(404).send('404 | Page Not Found')
		} else {
			// Render Error Page or Redirect
			res.status(500).send('500 | Internal Server Error')
			console.error(`error during render : ${req.url}`)
			console.error(err.stack)
		}
	}

	const context = {
		title: "Vue Cli3 SSR",
		url: req.url
	}
	renderer.renderToString(context, (err, html) => {
		if(err) {
			return handleError(err)
		}
		res.send(html)
		if(!isProd) {
			console.log(`whole request: ${Date.now() - s}ms`)
		}
	})
}

let items = { 1: { title: "item1", content: "item1 content" } }
let id = 2
app.get("/api/items/:id", (req, res, next) => {
	res.json(items[req.params.id] || {})
})
app.get("/api/items", (req, res, next) => {
	res.json(items)
})

app.post("/api/items", (req, res, next) => {
	items[id] = req.body

	res.json({ id, item: items[id++] })
})

app.get('*', isProd ? render : (req, res) => {
	readyPromise.then(() => render(req, res))
})

const port = process.env.PORT || 8756
app.listen(port, () => {
	console.log(`server started at localhost:${port}`)
})
