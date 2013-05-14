'use strict';

var grunt = require('grunt');

exports.fscss = {
  setUp: function(done) {
    // setup here if necessary

    done();
  },
  basicTest: function(test) {
    test.expect(1);
    var generated = grunt.file.read('test/temp/style-fs.css');
    var expected = grunt.file.read('test/expected/style.css');
    test.equal(generated, expected, "should output a file as expected");
    test.done();
  },
  concTest: function(test) {
    test.expect(1);
    var generated = grunt.file.read('test/temp/style-conc-fs.css');
    var expected = grunt.file.read('test/expected/style-conc.css');
    test.equal(generated, expected, "should concatinate multiple files to one file");
    test.done();
  },
  concSeperatorTest: function(test) {
    test.expect(1);
    var generated = grunt.file.read('test/temp/style-conc-sep-fs.css');
    var expected = grunt.file.read('test/expected/style-conc-sep.css');
    test.equal(generated, expected, "should concatinate multiple files to one file with a different seperator");
    test.done();
  }
};
