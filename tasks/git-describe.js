/*
 * grunt-git-describe
 * https://github.com/mikaelkaron/grunt-git-describe
 *
 * Copyright (c) 2013 Mikael Karon
 * Licensed under the MIT license.
 */

module.exports = function (grunt) {
	"use strict";

	var _ = grunt.util._;
	var _process = require("grunt-util-process")(grunt);
	var _options = require("grunt-util-options")(grunt);
	var _spawn = require("grunt-util-spawn")(grunt);
	var _args = require("grunt-util-args")(grunt);
	var RE =/(?:(.*)-(\d+)-g)?([a-fA-F0-9]{7})(-dirty)?$/;
	var GIT_DESCRIBE = "git-describe";
	var CWD = "cwd";
	var COMMITISH = "commitish";
	var TEMPLATE = "template";
	var FAIL_ON_ERROR = "failOnError";

	// Initial OPTIONS
	var OPTIONS = {};
	OPTIONS[CWD] = ".";
	OPTIONS[TEMPLATE] = "{%=tag%}-{%=since%}-{%=object%}{%=dirty%}";
	OPTIONS[FAIL_ON_ERROR] = true;

	// Add GIT_DESCRIBE delimiters
	grunt.template.addDelimiters(GIT_DESCRIBE, "{%", "%}");

	// Register GIT_DESCRIBE task
	grunt.registerMultiTask(GIT_DESCRIBE, "Describes git commit", function (/* commitish, cwd, template */) {
		var me = this;

		// Start async task
		var done = me.async();

		// Get options and process
		var options = _process.call(_options.call(me, _.defaults(_args.call(me, COMMITISH, CWD, TEMPLATE), me.options(OPTIONS)), COMMITISH, CWD, TEMPLATE, FAIL_ON_ERROR), {
			"delimiters" : GIT_DESCRIBE
		}, COMMITISH, CWD, FAIL_ON_ERROR);

		// Log flags (if verbose)
		grunt.log.verbose.writeflags(options);

		// Spawn git
		_spawn({
			"cmd" : "git",
			"args" : [ "describe", "--tags", "--always", "--long", options[COMMITISH] || "--dirty" ],
			"opts" : {
				"cwd" : options[CWD]
			}
		}, function (err, result) {
			// If an error occurred...
			if (err) {
				// ... and we consider this case fatal
				if (options[FAIL_ON_ERROR]) {
					// Signal done with error
					done(err);
				} else {
					// Log the problem and signal done
					grunt.log.error(err).verbose.error(result);
					done();
				}

				// Make sure we don't continue
				return;
			}

			// Get matches
			var matches = result.toString().match(RE);

			// If we did not match...
			if (matches === null) {
				// ... and we consider this case fatal
				if (options[FAIL_ON_ERROR]) {
					// Signal done with error
					done(new Error("Unable to match '" + result + "'"));
				} else {
					// Log the problem and signal done
					grunt.log.error("Unable to match '" + result + "'");
					done();
				}

				// Make sure we don't continue
				return;
			}

			// Define extended properties on `matches`
			Object.defineProperties(matches, {
				"toString" : {
					"enumerable" : true,
					"value" : function(template) {
						var me = this;

						return grunt.template.process(template || me[TEMPLATE], {
							"data": me,
							"delimiters": GIT_DESCRIBE
						});
					}
				},

				"template" : {
					"enumerable": true,
					"value" : options[TEMPLATE],
					"writable" : true
				},

				"tag" : {
					"enumerable" : true,
					"get" : function () {
						return this[1];
					},
					"set" : function (value) {
						this[1] = value;
					}
				},

				"since" : {
					"enumerable" : true,
					"get" : function () {
						return this[2];
					},
					"set" : function (value) {
						this[2] = value;
					}
				},

				"object" : {
					"enumerable" : true,
					"get" : function () {
						return this[3];
					},
					"set" : function (value) {
						this[3] = value;
					}
				},

				"dirty" : {
					"enumerable" : true,
					"get" : function () {
						return this[4];
					},
					"set" : function (value) {
						this[4] = value;
					}
				}
			});

			// Emit
			grunt.event.emit(GIT_DESCRIBE, matches, options);

			// Log
			grunt.log.ok(matches);

			// Done
			done();
		});
	});
};
