/*
 * grunt-fscss
 * https://github.com/SebastianM/grunt-fscss
 *
 * Copyright (c) 2013 Sebastian Müller
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    fscss: {
      test: {
        options: {
          fileMapping: {
            '/overwrite/with/options.png': 'my_configured_ref_name'
          }
        },
        files: {
          'test/temp/style-fs.css': 'test/fixtures/style.css',
          'test/temp/style-conc-fs.css': ['test/fixtures/style.css', 'test/fixtures/style2.css'],
        }
      },
      testSeperator: {
        options: {
          seperator: '\n\n/* NEW FILE */\n\n',
          fileMapping: {
            '/overwrite/with/options.png': 'my_configured_ref_name'
          }
        },
        files: {
          'test/temp/style-conc-sep-fs.css': ['test/fixtures/style.css', 'test/fixtures/style2.css']
        }
      },
      testComment: {
        options: {
          addFilenameComment: true
        },
        files: {
          'test/temp/style-comment.css': 'test/fixtures/style-comment.css',
        }
      },
      testCacheStrategyRevision: {
        options: {
          cacheStrategy: 'revision'
        },
        files: {
          'test/temp/style-cache-strategy-revision.css': 'test/fixtures/style-cache-strategy-revision.css',
        }
      },
    },

    clean: {
      tests: ['test/temp']
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

    changelog: {
      options: {
        dest: 'CHANGELOG.md',
        github: 'https://github.com/SebastianM/grunt-fscss',
        editor: 'sublime -w'
      }
    }
  });

  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-conventional-changelog');

  // Whenever the "test" task is run, first clean the "test/temp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'fscss:test', 'fscss:testSeperator', 'fscss:testComment', 'fscss:testCacheStrategyRevision', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['test']);

};
