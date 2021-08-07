/** @type {import('@types/webpack').Configuration} */
const configuration = {
  target: 'webworker',
  entry: './index.js',
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
``;
