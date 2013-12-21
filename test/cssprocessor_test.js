'use strict';

var grunt = require('grunt');
var CssProcessor = require('../lib/cssprocessor.js');

exports.fscss = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  intializeCorrectly: function(test) {
    test.expect(1);
    var cssp = new CssProcessor("filecontent", "\n", false);
    test.equal(cssp.fileContent, "filecontent", "should initalize fileContent correctly");
    test.done();
  },
  basicTest: function(test) {
    test.expect(1);
    var cssp = new CssProcessor("body{background:url('my_file.jpg');}", "\n", false);
    var expected = "body{background:url('$CMS_REF(media:\"my_file\")$');}";
    test.equal(cssp.processFile(), expected, "should replace file reference correctly");
    test.done();
  },
  urlHttp: function(test) {
    test.expect(1);
    var cssp = new CssProcessor("body{background:url('http://media/my_file.jpg');}", "\n", false);
    var expected = "body{background:url('http://media/my_file.jpg');}";
    test.equal(cssp.processFile(), expected, "should not replace URL (http://) file");
    test.done();
  },
  urlHttps: function(test) {
    test.expect(1);
    var cssp = new CssProcessor("body{background:url('https://media/my_file.jpg');}", "\n", false);
    var expected = "body{background:url('https://media/my_file.jpg');}";
    test.equal(cssp.processFile(), expected, "should not replace URL (https://) file");
    test.done();
  },
  noFileName: function(test) {
    test.expect(1);
    var cssp = new CssProcessor("body{background:url(/);}", "\n", false);
    var expected = "body{background:url(/);}";
    test.equal(cssp.processFile(), expected, "should not replace /");
    test.done();
  },
  emptyUrl: function(test) {
    test.expect(1);
    var cssp = new CssProcessor("body{background:url();}", "\n", false);
    var expected = "body{background:url();}";
    test.equal(cssp.processFile(), expected, "should not replace empty url()");
    test.done();
  },
  hash: function(test) {
    test.expect(1);
    var cssp = new CssProcessor("body{background:url(my-font.svg?#iefix);}", "\n", false);
    var expected = "body{background:url($CMS_REF(media:\"my_font\")$?#iefix);}";
    test.equal(cssp.processFile(), expected, "should not replace hashes");
    test.done();
  },
  relativePath: function(test) {
    test.expect(1);
    var cssp = new CssProcessor("body{background:url(\"../../my/dir/is/great/image.jpg\");}", "\n", false);
    var expected = "body{background:url(\"$CMS_REF(media:\"image\")$\");}";
    test.equal(cssp.processFile(), expected, "should not replace files with relative path");
    test.done();
  },
  spaceInFilename: function(test) {
    test.expect(1);
    var cssp = new CssProcessor("body{background:url(\"my image.jpg\");}", "\n", false);
    var expected = "body{background:url(\"$CMS_REF(media:\"my_image\")$\");}";
    test.equal(cssp.processFile(), expected, "should replace spaces with _");
    test.done();
  },
  specialGerChars: function(test) {
    test.expect(1);
    var cssp = new CssProcessor("body{background:url(\"üäöß.jpg\");}", "\n", false);
    var expected = "body{background:url(\"$CMS_REF(media:\"ueaeoess\")$\");}";
    test.equal(cssp.processFile(), expected, "should not replace files with relative path");
    test.done();
  },
  basicCommentTest: function(test) {
    test.expect(1);
    var cssp = new CssProcessor("body{background:url('my_file.jpg');}", "\n", true);
    var expected = "body{background:url('$CMS_REF(media:\"my_file\")$');} /* my_file = my_file.jpg */";
    test.equal(cssp.processFile(), expected, "should add a filename comment");
    test.done();
  },
  dirCommentTest: function(test) {
    test.expect(1);
    var cssp = new CssProcessor("body{background:url('/some/deep/directory/my_file.jpg');}", "\n", true);
    var expected = "body{background:url('$CMS_REF(media:\"my_file\")$');} /* my_file = /some/deep/directory/my_file.jpg */";
    test.equal(cssp.processFile(), expected, "should add a dir to the comment");
    test.done();
  },
  urlCommentTest: function(test) {
    test.expect(1);
    var cssp = new CssProcessor("body{background:url('http://www.google.de/my_file.jpg');}", "\n", true);
    var expected = "body{background:url('http://www.google.de/my_file.jpg');}";
    test.equal(cssp.processFile(), expected, "should not add a filename comment if it's an url");
    test.done();
  }
};