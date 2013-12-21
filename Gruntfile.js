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
        files: {
          'test/temp/style-fs.css': 'test/fixtures/style.css',
          'test/temp/style-conc-fs.css': ['test/fixtures/style.css', 'test/fixtures/style2.css'],
        }
      },
      testSeperator: {
        options: {
          seperator: '\n\n/* NEW FILE */\n\n'
        },
        files: {
          'test/temp/style-conc-sep-fs.css': ['test/fixtures/style.css', 'test/fixtures/style2.css']
        }
      },
      testComment: {
        files: {
          'test/temp/style-comment.css': 'test/fixtures/style-comment.css',
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
        dest: 'README.md',
        github: 'https://github.com/SebastianM/grunt-fscss',
        editor: 'sublime -w'
      }
    }
  });

  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "test/temp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'fscss:test', 'fscss:testSeperator', 'fscss:testComment', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['test']);

};
