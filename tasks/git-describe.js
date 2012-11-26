module.exports = function( grunt ) {
	grunt.registerTask("describe", "Describes current git commit", function (propArg) {
		var done = this.async();
		var dirtyMark = grunt.config.process("describe.dirtyMark") || "-dirty";
		var prop = propArg || grunt.config.process("describe.prop") || "meta.version";

		grunt.log.write("Describe current commit: ");

		grunt.utils.spawn({
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
