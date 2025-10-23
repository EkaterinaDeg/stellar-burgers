const path = require('path');

module.exports = function override(config) {
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@ui': path.resolve(__dirname, 'src/components/ui'),
      '@ui-pages': path.resolve(__dirname, 'src/components/ui/pages'),
      '@utils-types': path.resolve(__dirname, 'src/utils/types'),
      '@api': path.resolve(__dirname, 'src/utils/burger-api.ts'),
      '@slices': path.resolve(__dirname, 'src/services/slices'),
      '@selectors': path.resolve(__dirname, 'src/services/selectors'),
      '@store': path.resolve(__dirname, 'src/services/store'),
      '@reducers': path.resolve(__dirname, 'src/services/reducers'),
    },
  };
  return config;
};