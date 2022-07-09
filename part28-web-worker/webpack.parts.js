const path = require('path')
const glob = require('glob') // https://www.npmjs.com/package/glob
const { MiniHtmlWebpackPlugin } = require('mini-html-webpack-plugin')
const { WebpackPluginServe } = require('webpack-plugin-serve')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const PurgeCSSPLugin = require('purgecss-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')
const { GitRevisionPlugin } = require('git-revision-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const BundleAnalyzerPlugin =
	require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// using glob we can get an array of all the files in src
const ALL_FILES = glob.sync(path.join(__dirname, 'src/**/*.js'))

const APP_SOURCE = path.join(__dirname, 'src')

exports.devServer = () => ({
	watch: true,
	plugins: [
		new WebpackPluginServe({
			port: process.env.PORT || 8080,
			static: './dist',
			liveReload: true,
			waitForBuild: true
		})
	]
})

exports.loadCSS = () => ({
	module: {
		rules: [{ test: /\.css$/, use: ['style-loader', 'css-loader'] }]
	}
})

exports.eliminateUnusedCSS = () => ({
	plugins: [
		new PurgeCSSPLugin({
			paths: ALL_FILES,
			extractors: [
				{
					extractor: content => content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [],
					extension: ['html']
				}
			]
		})
	]
})

exports.extractCSS = ({ options = {}, loaders = [] } = {}) => {
	return {
		module: {
			rules: [
				{
					test: /\.css$/,
					use: [
						{ loader: MiniCssExtractPlugin.loader, options },
						'css-loader'
					].concat(loaders),
					sideEffects: true
				}
			]
		},
		plugins: [
			new MiniCssExtractPlugin({
				filename: '[name].[contenthash].css'
			})
		]
	}
}

exports.tailwind = () => ({
	loader: 'postcss-loader',
	options: {
		postcssOptions: { plugins: [require('tailwindcss')()] }
	}
})

exports.eliminateUnusedCSS = () => ({})

exports.page = ({ title }) => ({
	plugins: [new MiniHtmlWebpackPlugin({ conttext: { title } })]
})

exports.autoprefixer = () => ({
	loader: 'postcss-loader',
	options: {
		postcssOptions: { plugins: [require('autoprefixer')()] }
	}
})

exports.babelLoader = () => ({
	module: {
		rules: [
			{
				test: /\/.js$/,
				include: path.join(__dirname, 'src'),
				exclude: path => path.match(/node_modules/),
				use: 'babel-loader'
			}
		]
	}
})

exports.loadImages = ({ limit }) => ({
	module: {
		rules: [
			{
				test: /\.(png|jpg)$/,
				type: 'asset',
				parser: { dataUrlCondition: { maxSize: limit } }
			}
		]
	}
})

exports.loadJavascript = () => ({
	module: {
		rules: [
			{
				test: /\.js$/,
				include: APP_SOURCE,
				use: 'babel-loader'
			}
		]
	}
})

exports.pathAlias = () => ({
	resolve: {
		alias: {
			components: path.resolve(__dirname, 'src/components/')
		}
	}
})

exports.generateSourceMaps = ({ type }) => ({
	devtool: type
})

exports.clean = () => ({ plugins: [new CleanWebpackPlugin()] })

exports.attachRevision = () => ({
	plugins: [
		new webpack.BannerPlugin({
			banner: new GitRevisionPlugin().version()
		})
	]
})

exports.minifyJavascript = () => ({
	optimization: { minimizer: [new TerserPlugin()] }
})

exports.minifyCSS = ({ options }) => ({
	optimization: {
		minimizer: [new CssMinimizerPlugin({ minimizerOptions: options })]
	}
})

exports.setFreeVariable = (key, value) => {
	const env = {}
	env[key] = JSON.stringify(value)

	return {
		plugins: [new webpack.DefinePlugin(env)]
	}
}

exports.bundleAnalyzer = () => ({
	plugins: [new BundleAnalyzerPlugin()]
})

exports.page = ({ title, url = '', chunks } = {}) => ({
	plugins: [
		new MiniHtmlWebpackPlugin({
			publicPath: '/',
			chunks,
			filename: `${url && url + '/'}index.html`,
			context: { title }
		})
	]
})
