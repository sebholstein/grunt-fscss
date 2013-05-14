# grunt-fscss [![Build Status](https://secure.travis-ci.org/SebastianM/grunt-fscss.png?branch=master)](http://travis-ci.org/SebastianM/grunt-fscss)

> Replaces media references in CSS files with valid FirstSpirit $CMS_REF(media:"")$ function calls.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-fscss --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-fscss');
```

## The "fscss" task

### Options

#### seperator
Type: `String`
Default: `\n\n`

Concatenated files will be joined on this string.

## Usage exmples

In your project's Gruntfile, add a section named `fscss` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  fscss: {
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Usage Examples

#### A Simple example
In this example, the default options are used to replace image references to FirstSpirit $CMS_REF(media:"")$ function calls:

```js
grunt.initConfig({
  fscss: {
    dist: {
      files: {
        'path/to/output-fs.css': ['path/to/input.css'],
      }
    }
  }
})
```

Some sample replacment could be:

```css
.box {
  background: url('images/my-Great-Picture.png') no-repeat;
}
```

gets replaced with:

```css
.box {
  background: url('$CMS_REF(media:"my_great_picture")$') no-repeat;
}
```

#### Multiple files per target
You can also configure multiple files that get concatenated to one output file like in this example:

```js
grunt.initConfig({
  fscss: {
    dist: {
      options: {
        seperator: '\n\n /* next file */ \n\n'
      },
      files: {
        'path/to/output-fs.css': ['path/to/input1.css', 'path/to/input2.css'],
      }
    }
  }
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
* 0.2.0 Added option to define a seperator for multiple concatinated CSS files
* 0.1.1 Fixed uuid generation algorithm
* 0.1.0 Initial release 
