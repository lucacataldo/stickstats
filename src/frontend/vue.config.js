module.exports = {
  publicPath: process.env.VUE_APP_PUB_PATH || '/',
  chainWebpack: (config) => {
    config.plugins.delete('prefetch');
  }
};
