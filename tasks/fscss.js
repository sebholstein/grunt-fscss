/*
 * grunt-fscss
 * https://github.com/SebastianM/grunt-fscss
 *
 * Copyright (c) 2013 Sebastian Müller
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var CssProcessor = require('../lib/cssprocessor.js');

  grunt.registerMultiTask('fscss', 'Replaces images references with FirstSpirit CMS_REF references', function() {
    // merge options with defaults
    var options = this.options({
      seperator: '\n\n'
    });

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {

      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.error('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        // Read file source.
        return grunt.file.read(filepath);
      }).join(options.seperator);

      if(src.toString().length < 1) {
        return grunt.log.warn("No (or only empty) css files found to process!");
      }

      // replace media references in given file
      var cssp = new CssProcessor(src.toString(), false, function(){});
      var srcp = cssp.processFile();
      
      // Write the destination file.
      grunt.file.write(f.dest, srcp);

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');
  });

  });
};
