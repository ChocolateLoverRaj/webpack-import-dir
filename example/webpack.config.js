module.exports = {
  entry: './src',
  mode: 'none',
  module: {
    rules: [{
      loader: 'babel-loader',
      options: {
        plugins: ['babel-plugin-import-dir-2']
      }
    }]
  },
  output: {
    library: {
      type: 'commonjs'
    }
  }
}
