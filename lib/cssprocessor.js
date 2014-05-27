/*
 * grunt-fscss
 * https://github.com/SebastianM/grunt-fscss
 *
 * Copyright (c) 2014 Sebastian Müller
 * Licensed under the MIT license.
 */

'use strict';

var CssProcessor = module.exports = function(fileContent, lineFeed, addFilenameComment) {
	this.fileContent = fileContent;
	this.addFilenameComment = !!addFilenameComment;
	this.lineFeed = lineFeed;
}

CssProcessor.prototype.processFile = function() {
	var lines = this.fileContent.split(this.lineFeed);
	var _this = this, lineFilenameComments = [], comment = '';

	// iterate over all lines
	lines.forEach(function(lineContent, i) {
		lineFilenameComments = [];

		// replace url() calls in current line
		lineContent = lineContent.replace(/url\(\s*['"]?([^'"\)#?]+)(?:[#?](?:[^'"\)]*))?['"]?\s*\)/gm, function (match, src) {
			// don't replace:
			// - external media references (http:// or https://)
			// - base64 data
			if(src === "/" || src.length < 1 || _this.isHttpFile(src) || _this.isBase64Data(src)) {
				return match;	
			}

			var filename = src.replace(/^.*[\\\/]/, '').replace(/\.[^/.]+$/, "");
			var uuid = _this.replaceSpecialChars(filename).toLowerCase();
			var cmsRef = match.replace(src, '$CMS_REF(media:"' + uuid + '")$');
			
			if (_this.addFilenameComment) {
				lineFilenameComments.push(uuid + ' = ' + src);	
			}

			return cmsRef;
    });

    // create comment string for the current line
    if (lineFilenameComments.length > 0) {
    	comment = lineFilenameComments.join(', ');
    	comment = ' /* ' + comment + ' */';
    } else {
    	comment = '';
    }

		// write new lineContent to back lines array
    lines[i] = lineContent + comment;
	});

	return lines.join('\n');
}

CssProcessor.prototype.replaceSpecialChars = function(value) {
	return value.toString()
		.replace("ä", "ae")
		.replace("Ä", "ae")
		.replace("ü", "ue")
		.replace("Ü", "ue")
		.replace("ö", "oe")
		.replace("Ö", "oe")
		.replace("ß", "ss")
		.replace(/[^A-Za-z0-9@]/g, "_");
};

CssProcessor.prototype.isHttpFile = function(filename) {
	var pattern = /^(https?:\/\/)/;
	return pattern.test(filename);
};

CssProcessor.prototype.isBase64Data = function(filename) {
	if (typeof filename !== 'string') {
		return false;
	}

	var pattern = /^data:[a-zA-Z0-9 \/+]+([; ]+)?(charset\=(\")?.+(\")?)?(\w+?base64(\w+)?,(\w)?)?\w+?,.*/ig;
	return pattern.test(filename);
};

