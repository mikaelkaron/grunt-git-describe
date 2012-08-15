module.exports = function( grunt ) {

	grunt.registerTask("describe", "Describes current git commit", function () {
		var done = this.async();

		grunt.utils.spawn({
			cmd : "git",
			args : [ "describe", "--tags", "--always", "--long", "--dirty" ]
		}, function (err, result) {
			if (err) {
				grunt.log.error(err);
				return done(false);
			}

			grunt.config("meta.version", result);

			done(result);
		});
	});
};