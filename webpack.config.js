const path = require('path');

module.exports = {
  entry: './App.js',  // Adjust to your main entry file
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),  // Change output folder if needed
  },
  module: {
    rules: [
      {
            test: /\.(sass|less|css)$/,
            use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader', // Use Babel loader for JS/JSX files
      },
      {
        test: /\.jsx$/, 
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'], // Configure Babel to handle modern JS and JSX
          },
        },
      },
    //   {
    //     test: /\.(png|jpe?g|gif|svg)$/i, // Add rule for images (adjust file types if necessary)
    //     use: [
    //       {
    //         loader: 'file-loader', // File loader for handling images
    //         options: {
    //           name: '[path][name].[ext]',
    //         },
    //       },
    //     ],
    //   },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i, // Add rule for fonts
        use: [
          {
            loader: 'file-loader', // File loader for handling fonts
            options: {
              name: '[path][name].[ext]',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
};
