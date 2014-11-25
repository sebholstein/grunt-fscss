'use strict';

var grunt = require('grunt');

exports.fscss = {
  basicTest: function(test) {
    test.expect(1);
    var generated = grunt.file.read('test/temp/style-fs.css');
    var expected = grunt.file.read('test/expected/style.css').replace(/\r/g, '');
    test.equal(generated, expected, "should output a file as expected");
    test.done();
  },
  concTest: function(test) {
    test.expect(1);
    var generated = grunt.file.read('test/temp/style-conc-fs.css');
    var expected = grunt.file.read('test/expected/style-conc.css').replace(/\r/g, '');
    test.equal(generated, expected, "should concatinate multiple files to one file");
    test.done();
  },
  concSeperatorTest: function(test) {
    test.expect(1);
    var generated = grunt.file.read('test/temp/style-conc-sep-fs.css');
    var expected = grunt.file.read('test/expected/style-conc-sep.css').replace(/\r/g, '');
    test.equal(generated, expected, "should concatinate multiple files to one file with a different seperator");
    test.done();
  },
  commentTest: function(test) {
    test.expect(1);
    var generated = grunt.file.read('test/temp/style-comment.css');
    var expected = grunt.file.read('test/expected/style-comment.css').replace(/\r/g, '');
    test.equal(generated, expected, "should add css comments");
    test.done();
  },
  cacheStrategyRevision: function(test) {
    test.expect(1);
    var generated = grunt.file.read('test/temp/style-cache-strategy-revision.css');
    var expected = grunt.file.read('test/expected/style-cache-strategy-revision.css').replace(/\r/g, '');
    test.equal(generated, expected, "should rid query param");
    test.done();
  }
};
