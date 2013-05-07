/*
 * grunt-git-describe
 * https://github.com/mikaelkaron/grunt-git-describe
 *
 * Copyright (c) 2013 Mikael Karon
 * Licensed under the MIT license.
 */

"use strict";

module.exports = function (grunt) {
	var CWD = "cwd";
	var PROP = "prop";
	var FAIL_ON_ERROR = "failOnError";
	var DIRTY_MARK = "dirtyMark";

	grunt.registerMultiTask("git-describe", "Describes current git commit", function (prop, cwd) {
		// Start async task
		var done = this.async();

		// Define default options
		var options = {};
		options[CWD] = ".";
		options[DIRTY_MARK] = "-dirty";
		options[FAIL_ON_ERROR] = true;

		// Load cli options (with defaults)
		options = this.options(options);

		// Override options
		options[PROP] = prop || options[PROP];
		options[CWD] = cwd || options[CWD];
		options[DIRTY_MARK] = grunt.option(DIRTY_MARK) || options[DIRTY_MARK];

		// Log flags (if verbose)
		grunt.log.verbose.writeflags(options);

		// Spawn git
		grunt.util.spawn({
			"cmd" : "git",
			"args" : [ "describe", "--tags", "--always", "--long", "--dirty=" + options[DIRTY_MARK] ],
			"opts" : {
				"cwd" : options[CWD]
			}
		}, function (err, result) {
			// If an error occurred...
			if (err) {
				// ... and we consider this case fatal
				if ( options[FAIL_ON_ERROR] ) {
					// Log the problem and tell grunt to stop
					done(false);
					grunt.fail.warn(err);
				} else {
                    // Log the problem and let grunt continue
					grunt.log.error(err,result);
					done();
				}
				return;
			}

			// Convert result to string
			result = String(result);

			// Output
			grunt.log.ok(result);

			// If we were passed a prop we should update
			if (options[PROP]) {
				grunt.config(options[PROP], result);
			}
            
			// Done with result
			done();
		});
	});
};
