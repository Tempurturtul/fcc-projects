import buble from 'rollup-plugin-buble';

export default {
	entry: 'src/index.js',
	dest: 'dist/bundle.js',
	format: 'iife',
	moduleName: 'Bundle',
	plugins: [buble()],
	sourceMap: 'inline'
};
