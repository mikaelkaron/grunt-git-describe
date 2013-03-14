module.exports = function( grunt ) {
	grunt.registerTask("describe", "Describes current git commit", function (propArg) {
		var done = this.async();
		var dirtyMark = grunt.config.get("describe.dirtyMark");
		var prop = propArg || grunt.config.get("describe.prop") || "meta.version";
		var util = "0.4" > grunt.version ? grunt.utils : grunt.util;

		dirtyMark = dirtyMark === null ? "-dirty" : dirtyMark;

		grunt.log.write("Describe current commit: ");

		util.spawn({
			cmd : "git",
			args : [ "describe", "--tags", "--always", "--long", "--dirty=" + dirtyMark ]
		}, function (err, result) {
			if (err) {
				grunt.log.error(err);
				return done(false);
			}

			grunt.config(prop, result);

			grunt.log.writeln((prop + " = " + result).green);

			done(result);
		});
	});
};
