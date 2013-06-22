[![Build Status](https://travis-ci.org/mikaelkaron/grunt-git-describe.png)](https://travis-ci.org/mikaelkaron/grunt-git-describe)
[![NPM version](https://badge.fury.io/js/grunt-git-describe.png)](http://badge.fury.io/js/grunt-git-describe)

# grunt-git-describe

> Describes current git commit

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

#### options.prop
Type: `String`  
Default value: `''`

A string value that is used as a property name for storing the result of this task

#### options.cwd
Type: `String`  
Default value: `'.'`

A string value that is used to do set the current working directory when spawning the `git` command

#### options.dirtyMark
Type: `String`  
Default value: `'-dirty'`

A string value that is used as the for the `dirty=` option passed to `git`

#### options.failOnError
Type: `boolean`  
Default value: `true`

A boolean that allows Grunt to keep going if there's an error in this task. This is useful if your build isn't guaranteed to always be run from within a Git repo.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
1.0 - First release, compatible with grunt `~0.3.0`  
2.0 - Updated version for grunt `~0.4.0`
