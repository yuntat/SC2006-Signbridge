module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      "babel-preset-expo",  // Use Expo's preset for React Native compatibility
      "@babel/preset-react",  // Handle React JSX syntax
      [
        "@babel/preset-env",  // Support for modern JS syntax
        {
          targets: "> 0.25%, not dead",  // Adjusts to target modern browsers
          useBuiltIns: "entry",  // Polyfill for modern JS features
          corejs: 3,  // Use CoreJS version 3 for polyfills
        },
      ],
    ],
    plugins: [
      "react-native-reanimated/plugin",  // If you're using React Native Reanimated
      [
        "module-resolver",
        {
          extensions: [".tsx", ".ts", ".js", ".json"],  // Support for TypeScript, JS, and JSON
        },
      ],
    ],
  };
};
