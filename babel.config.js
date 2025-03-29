module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      'babel-preset-expo',  // For Expo compatibility
      '@babel/preset-env',  // Support for modern JavaScript syntax
      '@babel/preset-react', // To handle React JSX syntax
    ],
    plugins: [
      'react-native-reanimated/plugin',  // For React Native Reanimated
      [
        'module-resolver',
        {
          extensions: ['.tsx', '.ts', '.js', '.json'],  // Support for TypeScript, JS, and JSON
        },
      ],
    ],
  };
};
