const path = require('path');
const merge = require('webpack-merge');

const PATHS = {
	root: path.join(__dirname, './'),
	app: path.join(__dirname, './js/app.js'),
	dist: path.join(__dirname, './dist'),
	serverPublic: '/dist/'
};

const commonConfig = {
	entry: {
		core: PATHS.app
	},
	output: {
		path: PATHS.dist, // output path
		filename: '[name].bundle.js',
		sourceMapFilename: '[file].map', // we use [file] so that source maps from javascript is not overwritten by source maps from css that have same [name]
		publicPath: PATHS.serverPublic
	},

	target: 'web',

	module: {
		rules: [
			{
				test: /\.js$/,
				loader: ['react-hot-loader/webpack', 'babel-loader'],
				exclude: /(node_modules)/
			}
		]
	},

	resolve: {
		alias: {
			'app-js': path.resolve(__dirname, 'js'),
			'app-css': path.resolve(__dirname, 'resources/css')
		}
	}
};

const DevServerConf = {
	port: 9000,
	proxy: 'http://localhost:3000/'
};

// function uses style loader and css loader to extract css from modules
// and insert them inline to html head tag
const loadCSS = function({ include, exclude, options } = {}) {
	return {
		module: {
			rules: [
				{
					test: /\.css$/,
					include: include,
					exclude: exclude,

					loader: [
						{
							loader: 'style-loader',
							options: options
						},
						'css-loader'
						// postCSSLoader
					]
				}
			]
		}
	};
};

const devConfig = merge([
	{
		// add here specific dev configuration
		devtool: 'eval-source-map',
		devServer: {
			contentBase: PATHS.dist,
			compress: true,
			port: DevServerConf.port,
			proxy: {
				'/': DevServerConf.proxy
			}
		}
	},
	// Warning - can't use loadCSS with extractCSS function!
	// development use inline style without source maps, it is faster
	loadCSS({
		options: {
			// add all styles to top of the head
			insertAt: 'bottom',
			sourceMap: false
		}
	})
]);

module.exports = merge([commonConfig, devConfig]);
