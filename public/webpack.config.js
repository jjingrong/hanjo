var webpack = require('webpack');
var path = require('path');

// path.resolve ref: https://nodejs.org/api/path.html#path_path_resolve_paths
var BUILD_DIR = path.resolve(__dirname, './React');	// path will resolve to "<CURRENT_DIR>/React"
var APP_DIR = path.resolve(__dirname, './React');

var config = {
	entry: APP_DIR + '/main.js',
	output: {
		path: BUILD_DIR,
		filename: 'prodbundle.js'
	},
	module : {
		// Use of loaders ref: http://webpack.github.io/docs/using-loaders.html
		loaders: [
			{	// babel-loader ref: https://github.com/babel/babel-loader
				test : /\.js?/,	// transformation only on .js files. use test: /\.jsx?$/ for both .js and .jsx
				include : APP_DIR,
				loader : 'babel'
			},
			{	// style-loader/css-loader recommended config ref: https://github.com/webpack/style-loader
				test: /\.css$/,
				exclude: /\.useable\.css$/,
				loader: "style-loader!css-loader"
			},
			{	// style-loader/css-loader recommended config ref: https://github.com/webpack/style-loader
				test: /\.useable\.css$/,
				loader: "style-loader/useable!css-loader"
			}
		]
	}
};
	
module.exports = config;
