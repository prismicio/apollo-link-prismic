import babel from '@rollup/plugin-babel';
import { terser } from "rollup-plugin-terser";

const options = {
  input: './src/index.js',
  output: {
    format: 'cjs',
    file: './dist/apollo-link-prismic.min.js',
  },
  plugins: [
    babel({ babelHelpers: 'bundled' }),
    terser()
  ],
};

export default options
