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
	var GIT_DESCRIBE = "git-describe";
	var FAIL_ON_ERROR = "failOnError";
	var CWD = "cwd";
	var COMMITISH = "commitish";
	var TEMPLATE = "template";
	var RE =/(?:(.*)-(\d+)-g)?([a-fA-F0-9]{7})(-dirty)?$/;

	// Initial OPTIONS
	var OPTIONS = {};
	OPTIONS[CWD] = ".";
	OPTIONS[TEMPLATE] = "{%=tag%}-{%=since%}-{%=object%}{%=dirty%}";

	// Add GIT_DESCRIBE delimiters
	grunt.template.addDelimiters(GIT_DESCRIBE, "{%", "%}");

	// Register GIT_DESCRIBE task
	grunt.registerMultiTask(GIT_DESCRIBE, "Describes git commit", function (/* commitish, cwd, template */) {
		// Start async task
		var done = this.async();

		// Get task options
		var options = this.options(OPTIONS);

		// Store some locals
		var name = this.name;
		var target = this.target;
		var args = this.args;

		// Populate `options` with values
		_.each([ COMMITISH, CWD, TEMPLATE ], function (key, index) {
			options[key] = _.find([
				args[index],
				grunt.option([ name, target, key ].join(".")),
				grunt.option([ name, key ].join(".")),
				grunt.option(key),
				options[key]
			], function (value) {
				return grunt.util.kindOf(value) !== "undefined";
			});
		});

		// Process `options` with template
		_.each([ COMMITISH, CWD, FAIL_ON_ERROR ], function (key) {
			var value = options[key];

			if (grunt.util.kindOf(value) === "string") {
				options[key] = grunt.template.process(value, {
					"delimiters" : GIT_DESCRIBE
				});
			}
		});

		// Log flags (if verbose)
		grunt.log.verbose.writeflags(options);

		// Spawn git
		grunt.util.spawn({
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
					// Log the problem and tell grunt to stop
					done(false);
					grunt.fail.warn(err);
				} else {
					// Log the problem and let grunt continue
					grunt.log.error(err, result);
					done();
				}
			}

			// Get matches
			var matches = result.toString().match(RE);

			// If we did not match...
			if (matches === null) {
				// ... and we consider this case fatal
				if (options[FAIL_ON_ERROR]) {
					// Log the problem and tell grunt to stop
					done(false);
					grunt.fail.warn("Unable to match '" + result + "'");
				} else {
					// Log the problem and let grunt continue
					grunt.log.error("Unable to match '" + result + "'");
					done();
				}
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

			// Done with result
			done(matches);
		});
	});
};
