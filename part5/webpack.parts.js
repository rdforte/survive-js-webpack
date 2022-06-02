const { MiniHtmlWebpackPlugin } = require('mini-html-webpack-plugin')
const { WebpackPluginServe } = require('webpack-plugin-serve')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

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
				filename: '[name].css'
			})
		]
	}
}

exports.page = ({ title }) => ({
	plugins: [new MiniHtmlWebpackPlugin({ conttext: { title } })]
})
