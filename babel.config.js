module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      'babel-preset-expo',  // Expo preset for React Native compatibility
      '@babel/preset-react',  // To handle JSX syntax
      [
        '@babel/preset-env',  // Support for modern JavaScript
        {
          targets: '> 0.25%, not dead',  // Ensure compatibility with modern browsers
          useBuiltIns: 'entry',
          corejs: 3,
        },
      ],
    ],
    plugins: [
      'react-native-reanimated/plugin',  // For React Native Reanimated (if needed)
      [
        'module-resolver',
        {
          extensions: ['.tsx', '.ts', '.js', '.json'],
        },
      ],
    ],
  };
};
