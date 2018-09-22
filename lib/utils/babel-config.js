module.exports = {
	exclude: ['node_modules/**'],
	presets: [require.resolve('babel-preset-extendscript')],
	plugins: [
		[
			require.resolve('babel-plugin-transform-react-jsx'),
			{
				pragma: 'h',
				useBuiltIns: true,
			},
		],
		[
			require.resolve('babel-plugin-auto-import'),
			{
				declarations: [
					{'default': 'Afterscript', 'members': ['h'], 'path': 'afterscript'},
				],
			},
		],
	],
};
