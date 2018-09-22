import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
const babelConfig = require('./lib/utils/babel-config');

export default {
	input: 'index.js',
	output: {
		name: 'AfterScript',
		file: `dist/index.js`,
		format: 'esm',
		sourcemap: false,
	},
	plugins: [
		babel(babelConfig),
		resolve(),
		commonjs(),
	],
};


