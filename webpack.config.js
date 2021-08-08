/** @type {import('@types/webpack').Configuration} */
const configuration = {
  target: 'webworker',
  entry: './src/index.js',
  mode: 'none',
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            assumptions: {
              noDocumentAll: true,
            },
            plugins: [
              // Webpack 4's parser breaks with the .? and ?? operators, so we use babel JUST to transpile those.
              '@babel/plugin-proposal-optional-chaining',
              '@babel/plugin-proposal-nullish-coalescing-operator',
            ],
          },
        },
      },
    ],
  },
};

module.exports = configuration;
