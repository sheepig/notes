const path = require('path');
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
	entry: path.resolve(__dirname, 'index.js'),
	output: {
    filename: '[name].[hash].js', 
    path: path.join(__dirname, '../dist'), 
		publicPath: '/public' 
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				use: {
					loader: 'babel-loader',
					options: {
            presets: ['env','react']
          }
				},
				exclude: /node_modules/
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
          use: "css-loader"
				})
			}
		]
	},
	plugins: [
    // 处理HTML文件
    new HtmlWebpackPlugin({
        template: './src/index.html'
    }),
    // 独立css文件
    new ExtractTextPlugin("css/[name].css"),
    // 提出公共模块
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',   // 公共模块名
      filename: 'js/base.js'  // 打包的目录
    })
  ],
  devServer: {
    port: 8086
  }
}