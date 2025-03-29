const path = require('path');

module.exports = {
  entry: './App.js',  // Adjust to your main entry file
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),  // Change output folder if needed
  },
  module: {
    rules: [
      // Load CSS, SASS, and LESS files
      {
        test: /\.(sass|less|css)$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
      // Babel loader for both .js and .jsx files
      {
        test: /\.(js|jsx)$/,  // Handle both .js and .jsx files
        exclude: /node_modules/,
        use: 'babel-loader', // Use Babel loader for JS/JSX files
      },
      // Handle images with file-loader
      {
        test: /\.(png|jpe?g|gif|svg)$/i,  // Add rule for images (adjust file types if necessary)
        use: [
          {
            loader: 'file-loader',  // File loader for handling images
            options: {
              name: '[path][name].[ext]',
            },
          },
        ],
      },
      // Handle fonts with file-loader
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,  // Add rule for fonts
        use: [
          {
            loader: 'file-loader',  // File loader for handling fonts
            options: {
              name: '[path][name].[ext]',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],  // Make sure Webpack knows to resolve .jsx files
  },
};
