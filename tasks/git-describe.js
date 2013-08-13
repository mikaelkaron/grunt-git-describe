/*
 * grunt-git-describe
 * https://github.com/mikaelkaron/grunt-git-describe
 *
 * Copyright (c) 2013 Mikael Karon
 * Licensed under the MIT license.
 */

"use strict";

module.exports = function (grunt) {
	var PROP = "prop";
	var CALLBACK = "callback";
	var FAIL_ON_ERROR = "failOnError";
	var CWD = "cwd";
	var COMMITISH = "commitish";
	var TEMPLATE = "template";
	var RE =/(?:(.*)-(\d+)-g)?([a-fA-F0-9]{7})(-dirty)?$/;

	var OPTIONS = {};
	OPTIONS[CWD] = ".";
	OPTIONS[TEMPLATE] = "{%=tag%}-{%=since%}-{%=object%}{%=dirty%}";

	// Register additional delimiters
	grunt.template.addDelimiters("git-describe", "{%", "%}");

	grunt.registerMultiTask("git-describe", "Describes git commit", function (cwd, commitish, template) {
		// Start async task
		var done = this.async();

		// Store some locals
		var name = this.name;
		var target = this.target;
		var args = this.args;

		// Get task options
		var options = this.options(OPTIONS);

		// Update `options` with cli values
		[ CWD, COMMITISH, TEMPLATE ].forEach(function (key, index) {
			options[key] = [
				args[index],
				grunt.option([ name, target, key ].join(".")),
				grunt.option([ name, key ].join(".")),
				grunt.option(key)
			].filter(function (value) {
				return grunt.util.kindOf(value) !== "undefined";
			})[0] || options[key];
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
				if ( options[FAIL_ON_ERROR] ) {
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
				if ( options[FAIL_ON_ERROR] ) {
					// Log the problem and tell grunt to stop
					done(false);
					grunt.fail.warn("Unable to math '" + result + "'");
				} else {
                    // Log the problem and let grunt continue
					grunt.log.error("Unable to math '" + result + "'");
					done();
				}
			}

			// Define extended properties on `matches`
			Object.defineProperties(matches, {
				"toString" : {
					"enumerable" : true,
					"value" : function(override) {
						var me = this;

						return grunt.template.process(override || me[TEMPLATE], {
							"data": me,
							"delimiters": "git-describe"
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

			// Log
			grunt.log.ok(matches);

			// If we were passed a prop we should update
			if (options[PROP]) {
				grunt.config(options[PROP], matches);
			}

			// If we were passed a callback we should call
			if (grunt.util.kindOf(options[CALLBACK]) === "function") {
				options[CALLBACK].call(null, matches);
			}

			// Done with result
			done(matches);
		});
	});
};
