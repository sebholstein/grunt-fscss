/*
 * grunt-fscss
 * https://github.com/SebastianM/grunt-fscss
 *
 * Copyright (c) 2013 Sebastian Müller
 * Licensed under the MIT license.
 */

'use strict';

var CssProcessor = module.exports = function(file_content, report, log_callback) {
	this.file_content = file_content;
	this.report = report;
	this.log_callback = log_callback || function() {};
}

CssProcessor.prototype.processFile = function() {
	var _this = this;
	return this.file_content.replace(/url\(\s*['"]?([^'"\)#?]+)(?:[#?](?:[^'"\)]*))?['"]?\s*\)/gm, function (match, src) {
		// don't replace external media references (http:// or https://)
		if(_this.isHttpFile(src) || src === "/" || src.length < 1) {
			return match.replace(src, src);	
		}

		var filename = src.replace(/^.*[\\\/]/, '').replace(/\.[^/.]+$/, "");
		var uuid = _this.replaceSpecialChars(filename).toLowerCase();
		var cms_ref = match.replace(src, '$CMS_REF(media:"' + uuid + '")$');

		return cms_ref;
    });
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
		.replace(/[^A-Za-z0-9]/g, "_");
};

CssProcessor.prototype.isHttpFile = function(filename) {
	var pattern = /^(https?:\/\/)/;
	return pattern.test(filename);
};

CssProcessor.prototype.log = function(message) {
	this.log_callback(message);
}

