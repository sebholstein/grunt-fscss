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
    var cssp = new CssProcessor("body{background:url('my_file.jpg');}", "\n", {
      addFilenameComment: false
    });
    var expected = "body{background:url('$CMS_REF(media:\"my_file\")$');}";
    test.equal(cssp.processFile(), expected, "should replace file reference correctly");
    test.done();
  },
  urlHttp: function(test) {
    test.expect(1);
    var cssp = new CssProcessor("body{background:url('http://media/my_file.jpg');}", "\n", {
      addFilenameComment: false
    });
    var expected = "body{background:url('http://media/my_file.jpg');}";
    test.equal(cssp.processFile(), expected, "should not replace URL (http://) file");
    test.done();
  },
  urlHttps: function(test) {
    test.expect(1);
    var cssp = new CssProcessor("body{background:url('https://media/my_file.jpg');}", "\n", {
      addFilenameComment: false
    });
    var expected = "body{background:url('https://media/my_file.jpg');}";
    test.equal(cssp.processFile(), expected, "should not replace URL (https://) file");
    test.done();
  },
  noFileName: function(test) {
    test.expect(1);
    var cssp = new CssProcessor("body{background:url(/);}", "\n", {
      addFilenameComment: false
    });
    var expected = "body{background:url(/);}";
    test.equal(cssp.processFile(), expected, "should not replace /");
    test.done();
  },
  emptyUrl: function(test) {
    test.expect(1);
    var cssp = new CssProcessor("body{background:url();}", "\n", {
      addFilenameComment: false
    });
    var expected = "body{background:url();}";
    test.equal(cssp.processFile(), expected, "should not replace empty url()");
    test.done();
  },
  hash: function(test) {
    test.expect(1);
    var cssp = new CssProcessor("body{background:url(my-font.svg?#iefix);}", "\n", {
      addFilenameComment: false
    });
    var expected = "body{background:url($CMS_REF(media:\"my_font\")$?#iefix);}";
    test.equal(cssp.processFile(), expected, "should not replace hashes");
    test.done();
  },
  relativePath: function(test) {
    test.expect(1);
    var cssp = new CssProcessor("body{background:url(\"../../my/dir/is/great/image.jpg\");}", "\n", {
      addFilenameComment: false
    });
    var expected = "body{background:url(\"$CMS_REF(media:\"image\")$\");}";
    test.equal(cssp.processFile(), expected, "should not replace files with relative path");
    test.done();
  },
  spaceInFilename: function(test) {
    test.expect(1);
    var cssp = new CssProcessor("body{background:url(\"my image.jpg\");}", "\n", {
      addFilenameComment: false
    });
    var expected = "body{background:url(\"$CMS_REF(media:\"my_image\")$\");}";
    test.equal(cssp.processFile(), expected, "should replace spaces with _");
    test.done();
  },
  specialGerChars: function(test) {
    test.expect(1);
    var cssp = new CssProcessor("body{background:url(\"üäöß.jpg\");}", "\n", {
      addFilenameComment: false
    });
    var expected = "body{background:url(\"$CMS_REF(media:\"ueaeoess\")$\");}";
    test.equal(cssp.processFile(), expected, "should not replace files with relative path");
    test.done();
  },
  basicCommentTest: function(test) {
    test.expect(1);
    var cssp = new CssProcessor("body{background:url('my_file.jpg');}", "\n", {
      addFilenameComment: true,
    });
    var expected = "body{background:url('$CMS_REF(media:\"my_file\")$');} /* my_file = my_file.jpg */";
    test.equal(cssp.processFile(), expected, "should add a filename comment");
    test.done();
  },
  dirCommentTest: function(test) {
    test.expect(1);
    var cssp = new CssProcessor("body{background:url('/some/deep/directory/my_file.jpg');}", "\n", {
      addFilenameComment: true
    });
    var expected = "body{background:url('$CMS_REF(media:\"my_file\")$');} /* my_file = /some/deep/directory/my_file.jpg */";
    test.equal(cssp.processFile(), expected, "should add a dir to the comment");
    test.done();
  },
  urlCommentTest: function(test) {
    test.expect(1);
    var cssp = new CssProcessor("body{background:url('http://www.google.de/my_file.jpg');}", "\n", {
      addFilenameComment: true,
    });
    var expected = "body{background:url('http://www.google.de/my_file.jpg');}";
    test.equal(cssp.processFile(), expected, "should not add a filename comment if it's an url");
    test.done();
  },
  atCharTest: function(test) {
    test.expect(1);
    var cssp = new CssProcessor("body{background:url('my_file@2x.jpg');}", "\n", {
      addFilenameComment: false
    });
    var expected = "body{background:url('$CMS_REF(media:\"my_file@2x\")$');}";
    test.equal(cssp.processFile(), expected, "should not replace @ chars");
    test.done();
  },
  base64png: function(test) {
    test.expect(1);
    var cssp = new CssProcessor("body{background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAFWHRTb2Z0d2FyZQBBZG);}", "\n", {
      addFilenameComment: false
    });
    var expected = "body{background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAFWHRTb2Z0d2FyZQBBZG);}";
    test.equal(cssp.processFile(), expected, "should not replace base64 data");
    test.done();
  },
  base64Whitespace: function(test) {
    test.expect(1);
    var style = 'body {background-image: url("data: image/svg+xml ; base64, PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSI2cHgiIGhlaWdodD0iM3B4IiB2aWV3Qm94PSIwIDAgNiAzIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA2IDMiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxwb2x5Z29uIHBvaW50cz0iNS45OTIsMCAyLjk5MiwzIC0wLjAwOCwwICIvPjwvc3ZnPg==");}';
    var cssp = new CssProcessor(style, '\n', {
      addFilenameComment: false
    });
    test.equal(cssp.processFile(), style, 'should not rewrite data urls with whitespaces');
    test.done();
  },
  base64Charset: function(test) {
    test.expect(1);
    var style = 'body {background-image: url("data: image/svg+xml;charset=utf-8;base64, PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSI2cHgiIGhlaWdodD0iM3B4IiB2aWV3Qm94PSIwIDAgNiAzIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA2IDMiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxwb2x5Z29uIHBvaW50cz0iNS45OTIsMCAyLjk5MiwzIC0wLjAwOCwwICIvPjwvc3ZnPg==");}';
    var cssp = new CssProcessor(style, '\n', {
      addFilenameComment: false
    });
    test.equal(cssp.processFile(), style, 'should not rewrite data urls with charset');
    test.done();
  },
  basicFileMapping: function(test) {
    test.expect(1);
    var cssp = new CssProcessor("body{background:url(\"../../my/dir/is/great/image.jpg\");}", "\n", {
      addFilenameComment: false,
      fileMapping: {
        '../../my/dir/is/great/image.jpg': 'abc_def'
      }
    });
    var expected = "body{background:url(\"$CMS_REF(media:\"abc_def\")$\");}";
    test.equal(cssp.processFile(), expected, "should use configured reference name");
    test.done();
  },
  advancedFileMapping: function(test) {
    test.expect(1);
    var cssp = new CssProcessor("body{background:url(\"../../my/dir/is/great/image.jpg\");}", "\n", {
      addFilenameComment: false,
      fileMapping: {
        '../../my/dir/is/great/image.jpg': {
          referenceName: 'my_custom_ref_name'
        }
      }
    });
    var expected = "body{background:url(\"$CMS_REF(media:\"my_custom_ref_name\")$\");}";
    test.equal(cssp.processFile(), expected, "should use configured reference name");
    test.done();
  },
  globalAbs: function(test) {
    test.expect(1);
    var cssp = new CssProcessor("body{background:url(\"../../my/dir/is/great/image.jpg\");}", "\n", {
      addFilenameComment: false,
      abs: 2
    });
    var expected = "body{background:url(\"$CMS_REF(media:\"image\", abs:2)$\");}";
    test.equal(cssp.processFile(), expected, "should add global abs option");
    test.done();
  },
  globalAbs0: function(test) {
    test.expect(1);
    var cssp = new CssProcessor("body{background:url(\"../../my/dir/is/great/image.jpg\");}", "\n", {
      addFilenameComment: false,
      abs: 0
    });
    var expected = "body{background:url(\"$CMS_REF(media:\"image\", abs:0)$\");}";
    test.equal(cssp.processFile(), expected, "should add global abs option");
    test.done();
  },
  overwriteGlobalAbs: function(test) {
    test.expect(1);
    var cssp = new CssProcessor("body{background:url(\"../../my/dir/is/great/image.jpg\");}", "\n", {
      addFilenameComment: false,
      abs: 2,
      fileMapping: {
        '../../my/dir/is/great/image.jpg': {
          abs: 1
        }
      }
    });
    var expected = "body{background:url(\"$CMS_REF(media:\"image\", abs:1)$\");}";
    test.equal(cssp.processFile(), expected, "should use abs option of fileMapping");
    test.done();
  },
  overwriteGlobalAbs0: function(test) {
    test.expect(1);
    var cssp = new CssProcessor("body{background:url(\"../../my/dir/is/great/image.jpg\");}", "\n", {
      addFilenameComment: false,
      abs: 2,
      fileMapping: {
        '../../my/dir/is/great/image.jpg': {
          abs: 0
        }
      }
    });
    var expected = "body{background:url(\"$CMS_REF(media:\"image\", abs:0)$\");}";
    test.equal(cssp.processFile(), expected, "should use abs option of fileMapping");
    test.done();
  }
};