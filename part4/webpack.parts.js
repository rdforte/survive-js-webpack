const { MiniHtmlWebpackPlugin } = require('mini-html-webpack-plugin')
const { WebpackPluginServe } = require('webpack-plugin-serve')

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

exports.page = ({ title }) => ({
	plugins: [new MiniHtmlWebpackPlugin({ conttext: { title } })]
})
