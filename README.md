# grunt-fscss [![Build Status](https://secure.travis-ci.org/SebastianM/grunt-fscss.png?branch=master)](http://travis-ci.org/SebastianM/grunt-fscss)

> Replaces media references in CSS files with valid FirstSpirit $CMS_REF(media:"")$ function calls.

[![NPM](https://nodei.co/npm/grunt-fscss.png?downloads=true)](https://nodei.co/npm/grunt-fscss/)

## Getting Started
This plugin requires Grunt `~0.4.5`

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

#### addFileNameComment
Type: `boolean`
Default: `false`

This option will add the source filename as a css comment at the end of each line where a url() call got replaced with a $CMS_REF()$ function call. This feature is mainly for debugging purposes.

#### abs
Type: `number`
Default: `undefined`

Global $CMS_REF()$ `abs configuration for all referenced files.

#### cacheStrategy
Type: `string`
Default: `undefined`

Possible options: `revision`

#### fileMapping
Type: `object`
Default: `{}`

If you need to make sure that a file gets a custom reference name in generated CSS or you want to overwrite global `abs` configuration, `fileMapping`is the way to go:

```js
grunt.initConfig({
  fscss: {
    dist: {
      options: {
        fileMapping: {
          // short syntax, just configure a custom reference name
          '/my/image.gif': 'my_image_2',
          // if you want to configure a custom reference name and an abs configuration:
          '/my/super/image.png': {
            referenceName: 'overwrite_ref_name',
            abs: 2
          }
        }
      }
    },
  },
})
````

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

Some sample replacement could be:

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

#### File comments in compiled CSS
When you enable the option `addFileNameComment` the processor will add comments to the end of the line with the source filenames that got replaced. Here's an example:

```js
grunt.initConfig({
  fscss: {
    options: {
      addFileNameComment: true
    }
    dist: {
      files: {
        'path/to/output-fs.css': ['path/to/input.css'],
      }
    }
  }
})
```

Some sample output could be:

```css
.box {
  background: url('images/my-Great-Picture.png') no-repeat;
}
```

gets replaced with:

```css
.box {
  background: url('$CMS_REF(media:"my_great_picture")$') no-repeat; /* my_great_picture = images/my-Great-Picture.png */
}
```

#### Cache Strategy
When you set the option `cacheStrategy` to `revision`, grunt-fscss will add a `?rid` query parameter with the FirstSpirit release revsion id to all CMS_REF calls. When no release revision ID is defined, FirstSpirit will fallback to `#global.now.timeInMillis`:
```css
.box {
  background: url('images/my-Picture.png') no-repeat;
}
```
gets replaced with:

```css
.box {
  background: url('$CMS_REF(media:"my_picture")$?rid=$CMS_VALUE(ref("my_picture").target.releaseRevision.id, default:#global.now.timeInMillis)$') no-repeat;
}
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Changelog
See [CHANGELOG.md](CHANGELOG.md)



[![Analytics](https://ga-beacon.appspot.com/UA-46864714-1/sebastianm/grunt-fscss)](https://github.com/igrigorik/ga-beacon)
