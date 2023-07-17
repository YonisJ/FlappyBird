module.exports = function (config) {
    config.set({
      frameworks: ['jasmine', 'browserify'],
      files: [
        'index.js',
        'Tests/functions.test.js',
      ],
      preprocessors: {
        'index.js': ['browserify'],
        'Tests/functions.test.js': ['browserify'],
      },
      browserify: {
        debug: true,
        transform: [['babelify', { presets: ['@babel/preset-env'] }]],
      },
      browsers: ['Chrome'],
      singleRun: true,
    });
  };
  