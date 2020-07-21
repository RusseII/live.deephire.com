const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
          modifyVars: { '@primary-color': '#55984f' },
          javascriptEnabled: true,
          }
        },
      },
    },
  ],
};