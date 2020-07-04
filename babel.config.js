module.exports = api => {
	api.cache(true);
	return {
		'presets': [
			'@babel/preset-flow',
			'@babel/preset-env',
			'@babel/preset-react',
		],
		'env': {
			'test': {
				'plugins': ['@babel/plugin-transform-runtime'],
			},
		},
		'plugins': [
			'@babel/plugin-proposal-object-rest-spread',
			'@babel/plugin-proposal-class-properties',
		],
	};
};
