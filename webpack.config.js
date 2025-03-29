const path = require('path');

module.exports = {
  entry: './App.js',  // Adjust this to your main entry file
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),  // Adjust the output folder if needed
  },
  module: {
    rules: [
      // Handle CSS, LESS, and SASS files
      {
        test: /\.(sass|less|css)$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
      // Use babel-loader for both JS and JSX files
      {
        test: /\.(js|jsx)$/,  // Handle both .js and .jsx files
        exclude: /node_modules/,
        use: 'babel-loader',  // This ensures JSX files are processed
      },
      // Handle image files
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',  // Use file-loader for handling images
            options: {
              name: '[path][name].[ext]',
            },
          },
        ],
      },
      // Handle font files
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        use: [
          {
            loader: 'file-loader',  // Use file-loader for fonts
            options: {
              name: '[path][name].[ext]',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],  // Ensure Webpack knows to resolve .jsx files
  },
};
