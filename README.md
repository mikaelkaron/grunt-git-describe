[![Build Status](https://travis-ci.org/mikaelkaron/grunt-git-describe.png)](https://travis-ci.org/mikaelkaron/grunt-git-describe)
[![NPM version](https://badge.fury.io/js/grunt-git-describe.png)](http://badge.fury.io/js/grunt-git-describe)

# grunt-git-describe

> Describes git commit

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-git-describe --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-git-describe');
```

## The "git-describe" task

### Overview
In your project's Gruntfile, add a section named `git-describe` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  "git-describe": {
    "options": {
      // Task-specific options go here.
    },
    "your_target": {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

> Note that since this is a [multi-task](http://gruntjs.com/creating-tasks#multi-tasks) you have to have at least one target defined for `git-describe` (otherwise the task won't run)

### Options

#### options.cwd
Type: `String`  
Default value: `'.'`

A string value that is used to do set the current working directory when spawning the `git` command

#### options.commitish
Type: `String`  
Default value: `undefined`

A string value that is used as `commitish` for `git`. Default is to use `HEAD`.

### options.template
Type: `String`  
Default value: `{%=tag%}-{%=since%}-{%=object%}{%=dirty%}`

A string value used to format the result of this task

#### options.failOnError
Type: `boolean`  
Default value: `true`

A boolean that allows Grunt to keep going if there's an error in this task. This is useful if your build isn't guaranteed to always be run from within a Git repo.

### Saving Output
If you would like to save or otherwise use the retun value, use `grunt.event.emit`. Here is an example:
```js
grunt.registerTask('saveRevision', function() {
    grunt.event.once('git-describe', function (rev) {
        grunt.log.writeln("Git Revision: " + rev);
        grunt.option('gitRevision', rev);
    });    
    grunt.task.run('git-describe');
});
```

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

2.3.2 - Support CLI options  
2.3.1 - Externalize common code to separat modules  
2.3.0 - Added support for templated parameters  
2.2.0 - Removed support for `callback` and `prop` (use `grunt.event.emit` instead)  
2.1.0 - Added support for `callback` and `template` and deprecated `dirtyMark`  
2.0.0 - Updated version for grunt `~0.4.0`  
1.0.0 - First release, compatible with grunt `~0.3.0`
