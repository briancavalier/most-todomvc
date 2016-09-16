import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import buba from 'rollup-plugin-buba'

export default {
	entry: 'src/index.js',
	dest: 'js/app.js',
	plugins: [
		buba(),
		resolve({ jsnext: true }),
		commonjs({
			exclude: ['node_modules/symbol-observable/**', 'node_modules/most/**'],
			include: 'node_modules/**'
		})
	],
	format: 'iife'
}
