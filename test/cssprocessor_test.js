'use strict';

var grunt = require('grunt');
var CssProcessor = require('../lib/cssprocessor.js');

exports.fscss = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  intializeCorrectly: function(test) {
    test.expect(3);
    var log_function = function() {};
    var cssp = new CssProcessor("filecontent", false, log_function);
    test.equal(cssp.file_content, "filecontent", "should initalize file_content correctly");
    test.equal(cssp.report, false, "should initalize report correctly");
    test.equal(cssp.log_callback, log_function, "should initalize log_callback correctly");
    test.done();
  },
  basicTest: function(test) {
    test.expect(1);
    var log_function = function() {};
    var cssp = new CssProcessor("body{background:url('my_file.jpg');}", false, log_function);
    var expected = "body{background:url('$CMS_REF(media:\"my_file\")$');}";
    test.equal(cssp.processFile(), expected, "should replace file reference correctly");
    test.done();
  },
  urlHttp: function(test) {
    test.expect(1);
    var log_function = function() {};
    var cssp = new CssProcessor("body{background:url('http://media/my_file.jpg');}", false, log_function);
    var expected = "body{background:url('http://media/my_file.jpg');}";
    test.equal(cssp.processFile(), expected, "should not replace URL (http://) file");
    test.done();
  },
  urlHttps: function(test) {
    test.expect(1);
    var log_function = function() {};
    var cssp = new CssProcessor("body{background:url('https://media/my_file.jpg');}", false, log_function);
    var expected = "body{background:url('https://media/my_file.jpg');}";
    test.equal(cssp.processFile(), expected, "should not replace URL (https://) file");
    test.done();
  },
  noFileName: function(test) {
    test.expect(1);
    var log_function = function() {};
    var cssp = new CssProcessor("body{background:url(/);}", false, log_function);
    var expected = "body{background:url(/);}";
    test.equal(cssp.processFile(), expected, "should not replace /");
    test.done();
  },
  emptyUrl: function(test) {
    test.expect(1);
    var log_function = function() {};
    var cssp = new CssProcessor("body{background:url();}", false, log_function);
    var expected = "body{background:url();}";
    test.equal(cssp.processFile(), expected, "should not replace empty url()");
    test.done();
  },
  hash: function(test) {
    test.expect(1);
    var log_function = function() {};
    var cssp = new CssProcessor("body{background:url(my-font.svg?#iefix);}", false, log_function);
    var expected = "body{background:url($CMS_REF(media:\"my_font\")$?#iefix);}";
    test.equal(cssp.processFile(), expected, "should not replace hashes");
    test.done();
  },
  relativePath: function(test) {
    test.expect(1);
    var log_function = function() {};
    var cssp = new CssProcessor("body{background:url(\"../../my/dir/is/great/image.jpg\");}", false, log_function);
    var expected = "body{background:url(\"$CMS_REF(media:\"image\")$\");}";
    test.equal(cssp.processFile(), expected, "should not replace files with relative path");
    test.done();
  },
  spaceInFilename: function(test) {
    test.expect(1);
    var log_function = function() {};
    var cssp = new CssProcessor("body{background:url(\"my image.jpg\");}", false, log_function);
    var expected = "body{background:url(\"$CMS_REF(media:\"my_image\")$\");}";
    test.equal(cssp.processFile(), expected, "should replace spaces with _");
    test.done();
  },
  specialGerChars: function(test) {
    test.expect(1);
    var log_function = function() {};
    var cssp = new CssProcessor("body{background:url(\"üäöß.jpg\");}", false, log_function);
    var expected = "body{background:url(\"$CMS_REF(media:\"ueaeoess\")$\");}";
    test.equal(cssp.processFile(), expected, "should not replace files with relative path");
    test.done();
  }
};