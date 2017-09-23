const path = require('path');
 
module.exports = {
  context: path.join(__dirname, 'src'),
  entry: [
    './index.js',
  ],
  output: {
    path: path.join(__dirname, 'www'),
    filename: 'bundle.js',
  },
  module: {
   loaders: [
			{
				test: /\.js$/,
				loader: ['babel-loader'],
				exclude: /node_modules/,
			},
			{
				test: /\.css$/,
				loader: ['style-loader', 'css-loader']
			}
		]
  },
  resolve: {
    modules: [
      path.join(__dirname, 'node_modules'),
    ],
  },
};