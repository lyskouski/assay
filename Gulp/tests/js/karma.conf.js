/**
 * Karma [Jasmine] initialisation config
 *
 * @author Viachaslau Lyskouski <s.lyskouski@creativity.by>
 */
module.exports = function (config) {
    config.set({
        basePath: __dirname + '/../public/',
        frameworks: [
            'browserify',
            'fixture',
            'jasmine'
        ],
        client: {
            jasmine: {
                stopOnFailure: true
            }
        },
        browserify: {
            debug: true,
            plugin: ['proxyquireify/plugin'],
            extensions: ['.js']
        },
        preprocessors: {
            'js/**/*.spec.js': ['browserify']
        },
        files: [
            __dirname + '/*.test.js',
            'js/**/*.spec.js'
        ]
    });
};
