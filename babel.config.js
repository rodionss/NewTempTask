module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo', 'module:metro-react-native-babel-preset'],
    plugins: [
      [
        'module-resolver',
        {
          extensions: [
            '.js',
            '.jsx',
            '.ts',
            '.tsx',
            '.android.js',
            '.android.tsx',
            '.ios.js',
            '.ios.tsx',
          ],
          alias: {
            '@components': './src/components',
            '@utils': './src/utils',
            '@assets': './src/assets',
            '@screens': './src/screens',
            '@modules': './src/modules',
            '@app-types': './src/types',
          },
        },
      ],
    ],
  };
};
