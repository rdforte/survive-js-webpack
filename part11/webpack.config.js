const { mode, target, output } = require('webpack-nano/argv')
console.log('output:', output)
console.log('target:------------->', target)
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
	parts.pathAlias()
])

const productionConfig = merge([parts.eliminateUnusedCSS()])

const developmentConfig = merge([
	{ entry: ['webpack-plugin-serve/client'] },
	parts.devServer()
])

const getConfig = mode => {
	switch (mode) {
		case 'production':
			return merge(
				commonConfig,
				productionConfig,
				{ mode },
				{ target },
				{
					output: {
						path: path.resolve(__dirname, output)
					}
				}
			)
		case 'development':
			return merge(commonConfig, developmentConfig, { mode })
		default:
			throw new Error('trying to use unknown mode: ', mode)
	}
}

module.exports = getConfig(mode)
