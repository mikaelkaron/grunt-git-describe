module.exports = function( grunt ) {

	grunt.initConfig({
		lint: {
			files: [ "grunt.js", "tasks/**/*.js" ]
		},
		describe: { dirtyMarker: '+', prop: 'meta.git.version', },
	});

	grunt.registerTask( "default", "lint" );
	grunt.loadTasks("tasks/");
};
