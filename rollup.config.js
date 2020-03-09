import minify from 'rollup-plugin-babel-minify';

const options = {
  input: './src/index.js',
  output: {
    format: 'cjs',
    file: './dist/apollo-link-prismic.min.js',
  },
  plugins: [
    minify({
      // Options for babel-minify.
      sourceMap: false,
      comments: false,
    })
  ],
};

export default options
