module.exports = function( grunt ) {
	grunt.registerTask("describe", "Describes current git commit", function () {
    var done = this.async();
		var dirtyMark = grunt.config("describe.dirtyMark") || "-dirty";
		var util = "0.4" > grunt.version ? grunt.utils : grunt.util;

		grunt.log.write("Describe current commit: ");

		util.spawn({
			cmd : "git",
			args : [ "describe", "--tags", "--always", "--long", "--dirty=" + dirtyMark ]
		}, function (err, result) {
			if (err) {
				grunt.log.error(err);
				return done(false);
			}

			grunt.log.writeln(result.toString().green);

      var outFile;
      if (outFile = grunt.config('describe.out')) {
        grunt.file.write(outFile, result);
      }

			done(result);
		});
	});
};
