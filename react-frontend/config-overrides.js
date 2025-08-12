const { override, addWebpackPlugin, addBabelPlugin } = require('customize-cra');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = override(
  // Add bundle analyzer when ANALYZE env var is set
  process.env.ANALYZE && addWebpackPlugin(
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: 'bundle-report.html'
    })
  ),
  
  // Add compression plugin for gzip
  addWebpackPlugin(
    new CompressionPlugin({
      filename: '[path][base].gz',
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8,
    })
  ),
  
  // Add dynamic imports support
  addBabelPlugin('@babel/plugin-syntax-dynamic-import')
);




