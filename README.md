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

#### options.match
Type: `String`
Default value: `undefined`

Value for the --match command line option. If set, only consider tags matching this glob pattern, excluding the "refs/tags/" prefix.

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

#### Returned Object
The `rev` object returned makes several specific properties available, in addition to the full `toString` description.
```js
grunt.event.once('git-describe', function (rev) {
  grunt.log.writeln("Git rev tag: " + rev.tag);
  grunt.log.writeln("Git rev since: " + rev.since);
  grunt.log.writeln("Git rev object: " + rev.object); // The 6 character commit SHA by itself
  grunt.log.writeln("Git rev dirty: " + rev.dirty);   // A flag denoting whether all local changes are committed
});
```