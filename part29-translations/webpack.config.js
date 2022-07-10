const { mode, target, output } = require('webpack-nano/argv')
const { merge } = require('webpack-merge')
const path = require('path')
const parts = require('./webpack.parts')

const cssLoaders = [parts.autoprefixer(), parts.tailwind()]

const commonConfig = merge([
	{ entry: ['./src'] },
	{ mode },
	{ target },
	// PARTS
	parts.page({ title: 'Demo' }),
	// parts.loadCSS(),
	parts.extractCSS({ loaders: cssLoaders }),
	parts.babelLoader(),
	parts.loadImages({ limit: 1000 }),
	parts.loadJavascript(),
	parts.pathAlias(),
	parts.generateSourceMaps({ type: 'source-map' }),
	parts.clean(),
	parts.setFreeVariable('HELLO', 'hello from config')
])

const productionConfig = merge([
	{
		output: {
			path: path.resolve(process.cwd(), output),
			chunkFilename: '[name].[contenthash].js',
			filename: '[name].[contenthash].js',
			assetModuleFilename: '[name].[contenthash][ext][query]'
		}
	},
	parts.eliminateUnusedCSS(),
	{
		optimization: {
			splitChunks: { chunks: 'all' },
			runtimeChunk: { name: 'runtime' }
		}
	},
	parts.attachRevision(),
	parts.minifyJavascript(),
	parts.minifyCSS({ options: { preset: ['default'] } }),
	{ recordsPath: path.join(__dirname, 'records.json') }
	// parts.bundleAnalyzer()
])

const developmentConfig = merge([
	{ entry: ['webpack-plugin-serve/client'] },
	{
		output: {
			path: path.resolve(process.cwd(), output)
		}
	},
	parts.devServer()
])

const getConfig = mode => {
	switch (mode) {
		case 'production':
			return merge(commonConfig, productionConfig)
		case 'development':
			return merge(commonConfig, developmentConfig)
		default:
			throw new Error('trying to use unknown mode: ', mode)
	}
}

module.exports = getConfig(mode)
