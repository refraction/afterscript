const { join } = require('path');
const { readJsonSync } = require('fs-extra');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const replace = require('rollup-plugin-replace');
const babel = require('rollup-plugin-babel');
const minify = require('rollup-plugin-babel-minify');
const babelConfig = require('./babel-config');

const cwd = process.cwd();
const isDev = process.env.NODE_ENV !== 'production';
const pkg = readJsonSync(join(cwd, 'package.json'));
const scriptName = pkg.afterscript && pkg.afterscript.name ? pkg.afterscript.name : 'Script';
const scriptFileName = scriptName.replace(/(\s|-|_)/g, '');

const inputConfig = {
	input: pkg.main || 'index.js',
	plugins: [
		replace({
			values: {
				__SCRIPTNAME__: scriptFileName,
			},
		}),
		babel({
			exclude: ['node_modules/**'],
			...babelConfig,
		}),
		resolve(),
		commonjs(),
		!isDev && minify({ comments: false, removeConsole: true }),
	],
};

const outputConfig = {
	name: scriptName,
	file: `dist/${scriptFileName}.jsx`,
	format: 'umd',
	sourcemap: false,
};

module.exports = { inputConfig, outputConfig };
