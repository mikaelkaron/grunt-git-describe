module.exports = function( grunt ) {

	grunt.initConfig({
		lint: {
			files: [ "grunt.js", "tasks/**/*.js" ]
		},
		describe: { dirtyMark: '+', prop: 'meta.git.version' }
	});

	grunt.registerTask( "default", "lint" );
	grunt.loadTasks("tasks/");
};
