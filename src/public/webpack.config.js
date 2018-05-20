const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const PATHS = {
	root: path.join(__dirname, './'),
	app: path.join(__dirname, './js/app.js'),
	dist: path.join(__dirname, './dist'),
	serverPublic: '/dist/'
};

const clean = function(paths, options) {
	return {
		plugins: [new CleanWebpackPlugin(paths, options)]
	};
};

const commonConfig = merge([
	{
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
	},
	clean([PATHS.dist], {
		root: PATHS.root
	})
]);

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

// plugin function that extracts css to file
const extractCSS = function({ include, exclude, use }) {
	return {
		module: {
			rules: [
				{
					test: /\.css$/,
					include: include,
					exclude: exclude,

					loader: ExtractTextPlugin.extract({
						use: use,
						fallback: 'style-loader',
						publicPath: './'
					})
				}
			]
		},
		plugins: [
			// Output extracted CSS to a file
			new ExtractTextPlugin({
				filename: '[name].css'
				// allChunks: true,
			})
		]
	};
};

const minifyJavaScript = function({ useSourceMap }) {
	return {
		plugins: [
			new webpack.optimize.UglifyJsPlugin({
				sourceMap: useSourceMap,
				compress: {
					warnings: false
				}
			})
		]
	};
};

const definePlugin = function() {
	return {
		plugins: [
			new webpack.DefinePlugin({
				// react production
				'process.env.NODE_ENV': JSON.stringify('production')
			})
		]
	};
};

const devConfig = merge([
	commonConfig,
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

const prodConfig = merge([
	commonConfig,
	{
		// add here specific prod configuration
		devtool: 'source-map',

		module: {
			// before creating output for production check for error with es lint
			rules: [
				{
					test: /\.js$/,
					enforce: 'pre',

					loader: 'eslint-loader',
					options: {
						emitWarning: true,
						// Fail only on errors
						failOnWarning: false,
						failOnError: true,

						// Disable/enable autofix
						fix: true,

						// Output to Jenkins compatible XML
						outputReport: {
							filePath: 'checkstyle.xml',
							formatter: require('eslint/lib/formatters/checkstyle')
						}
					}
				}
			]
		}
	},

	// in case you need inline css uncomment lines bellow and comment extractCSS function
	// loadCSS({
	//     options: {
	//         // add all styles to top of the head
	//         insertAt: 'bottom',
	//         sourceMap: true,
	//         minimize: true
	//     }
	// }),
	// Warning - can't use extractCSS with loadCSS function!
	extractCSS({
		use: [
			{
				loader: 'css-loader',
				query: {
					camelCase: true,
					importLoaders: 1,
					sourceMap: true,
					allChunks: true,
					minimize: true
				}
			}
		]
	}),
	definePlugin(),
	// use uglify only in production
	minifyJavaScript({
		compress: {
			sequences: true,
			// eslint-disable-next-line camelcase
			dead_code: true,
			conditionals: true,
			booleans: true,
			unused: true,
			// eslint-disable-next-line camelcase
			if_return: true,
			// eslint-disable-next-line camelcase
			join_vars: true,
			// eslint-disable-next-line camelcase
			drop_console: true
		},
		mangle: {
			except: ['$super', '$', 'exports', 'require']
		},
		minimize: true,
		useSourceMap: true,
		output: {
			comments: false
		}
	})
]);

module.exports = env => {
	switch (env) {
		case 'dev':
			return devConfig;
		case 'prod':
			return prodConfig;
		default:
			throw new Error('Invalid environment variable.');
	}
};
