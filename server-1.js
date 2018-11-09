const fs = require("fs")
const path = require("path")
const express = require("express")
const server = express()
const { createBundleRenderer } = require("vue-server-renderer")

const bundle = require("./dist/vue-ssr-server-bundle.json")
const clientManifest = require("./dist/vue-ssr-client-manifest.json")
const template = fs.readFileSync("./src/index.template.html", "utf-8")

const renderer = createBundleRenderer(bundle, {
	// runInNewContext: false,
	template,
	clientManifest
})

server.use(express.static(path.join(__dirname, "./dist")))

server.get("*", (req, res) => {
	const context = { url: req.url }
	// 这里无需传入一个应用程序，因为在执行 bundle 时已经自动创建过
	renderer.renderToString(context, (err, html) => {
		const context = { url: req.originalUrl }
		// res.setHeader("Content-Type", "text/html")
		renderer.renderToString(context, (err, html) => {
			if (err) {
				if (err.code === 404) {
					res.status(404).end("Page not found")
				} else {
					res.status(500).end("Internal Server Error")
				}
			} else {
				res.end(html)
			}
		})
	})
})

const port = process.env.PORT || 8756
server.listen(port, () => {
	console.log(`server started at localhost:${port}`)
})
