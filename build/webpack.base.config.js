const path = require("path")
const webpack = require("webpack")
// const ExtractTextPlugin = require("extract-text-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin")
const { VueLoaderPlugin } = require("vue-loader")

const isProd = process.env.NODE_ENV === "production"

module.exports = {
	devtool: isProd ? false : "#cheap-module-source-map",
	output: {
		path: path.resolve(__dirname, "../dist"),
		publicPath: "/",
		filename: "[name].[chunkhash].js"
	},
	resolve: {
		alias: {
			"public": path.resolve(__dirname, "../public"),
			"@": path.resolve(__dirname, "../src")
		},
		extensions: ['.js', '.jsx', '.vue', '.json']
	},
	module: {
		noParse: /^(vue|vue-router|vuex|vuex-router-sync|es6-promise\.js)$/,
		rules: [
			{
				test: /\.vue$/,
				loader: "vue-loader",
				options: {
					compilerOptions: {
						preserveWhitespace: false,
						// vue-loader v15 选项被废弃
						// postcss: [
						// 	require('autoprefixer')({
						// 		browsers: ['last 3 versions']
						// 	})
						// ]
					}
				}
			},
			// 利用babel-loader编译js，使用更高的特性，排除npm下载的.vue组件
			// vue-loader 官方文档（从V14迁移）
			{
				test: /\.js$/,
				loader: "babel-loader",
				exclude: file => (
					/node_modules/.test(file) &&
					!/\.vue\.js/.test(file)
				)
			},
			// {
			// 	test: /\.css$/,
			// 	use: isProd
			// 		? ExtractTextPlugin.extract({
			// 			use: [
			// 				{
			// 					loader: "css-loader",
			// 					options: { minimize: true }
			// 				}
			// 			],
			// 			fallback: "vue-style-loader"
			// 		}) : ["vue-style-loader", "css-loader"]
			// },
			{
				test: /\.css$/,
				use: isProd ? [
					MiniCssExtractPlugin.loader,
					"css-loader",
				] : [
					"vue-style-loader",
					"css-loader"
				]
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				use: {
					loader: "url-loader",
					options: {
						limit: 10000,
						fallback: {
							loader: "file-loader",
							options: {
								name: "img/[name].[hash:8].[ext]"
							}
						}
					}
				}
			},
			{
				test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 4096,
							fallback: {
								loader: 'file-loader',
								options: {
									name: 'media/[name].[hash:8].[ext]'
								}
							}
						}
					}
				]
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 4096,
							fallback: {
								loader: 'file-loader',
								options: {
									name: 'fonts/[name].[hash:8].[ext]'
								}
							}
						}
					}
				]
			}
		]
	},
	// 配置如何展示性能提示
	performance: {
		maxEntrypointSize: 300000,
		hints: isProd ? "warning" : false
	},
	// By default webpack v4+ provides new common chunks strategies out of the box for dynamically imported modules.
	// See available options for configuring this behavior in the SplitChunksPlugin page.
	// This configuration object represents the default behavior of the SplitChunksPlugin
	// optimization: {
	// 	splitChunks: {
	// 		chunks: 'async',
	// 		minSize: 30000,
	// 		minChunks: 1,
	// 		maxAsyncRequests: 5,
	// 		maxInitialRequests: 3,
	// 		automaticNameDelimiter: '~',
	// 		name: true,
	// 		cacheGroups: {
	// 			vendors: {
	// 				test: /[\\/]node_modules[\\/]/,
	// 				priority: -10
	// 			},
	// 			default: {
	// 				minChunks: 2,
	// 				priority: -20,
	// 				reuseExistingChunk: true
	// 			}
	// 		}
	// 	}
	// }
	optimization: {
		minimize: true,	// Tell webpack to minimize the bundle using the UglifyjsWebpackPlugin.
		splitChunks: {
			chunks: "all"
		}
	},
	plugins: isProd ? [
		new VueLoaderPlugin(),
		// webpack 4 新的配置方式在 optimization.minimize 选项中
		// new webpack.optimize.UglifyJsPlugin({
		// 	compress: { warnings: false }
		// }),
		// 目前 extract-text-webpack-plugin 最新版本不支持 Webpack 4.3.0 版本. webpack 4.2.0 以下可用。
		// 未来 extract-text-webpack-plugin 将废弃，作者建议使用 mini-css-extract-plugin 插件
		// new ExtractTextPlugin({
		// 	filename: "common.[chunkhash].css"
		// })
		new MiniCssExtractPlugin({
			filename: isProd ? "[name].[chunkhash].css" : "[name].css",
			chunkFilename: isProd ? "[id].[chunkhash].css" : "[id].css"
		})
	] : [
		new VueLoaderPlugin(),
		new FriendlyErrorsPlugin()
	]
}
