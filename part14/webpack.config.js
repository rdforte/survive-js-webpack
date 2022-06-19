const { mode, target, output } = require('webpack-nano/argv')
const { merge } = require('webpack-merge')
const path = require('path')
const parts = require('./webpack.parts')

const cssLoaders = [parts.autoprefixer(), parts.tailwind()]

const commonConfig = merge([
	{ entry: ['./src'] },
	parts.page({ title: 'Demo' }),
	// parts.loadCSS(),
	parts.extractCSS({ loaders: cssLoaders }),
	parts.babelLoader(),
	parts.loadImages({ limit: 1000 }),
	parts.loadJavascript(),
	parts.pathAlias(),
	parts.generateSourceMaps({ type: 'source-map' }),
	{ mode },
	{ target },
	{
		output: {
			path: path.resolve(__dirname, output)
		}
	}
])

const productionConfig = merge([
	parts.eliminateUnusedCSS(),
	{ optimization: { splitChunks: { chunks: 'all' } } }
])

const developmentConfig = merge([
	{ entry: ['webpack-plugin-serve/client'] },
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