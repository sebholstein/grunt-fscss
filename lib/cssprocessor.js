/*
 * grunt-fscss
 * https://github.com/SebastianM/grunt-fscss
 *
 * Copyright (c) 2014 Sebastian Müller
 * Licensed under the MIT license.
 */

'use strict';

var CssProcessor = module.exports = function(fileContent, lineFeed, options) {
	this.fileContent = fileContent;
	options.addFilenameComment = options.addFilenameComment || false;
	this.options = options;
	this.lineFeed = lineFeed;
}

CssProcessor.prototype.processFile = function() {
	var lines = this.fileContent.split(this.lineFeed);
	var lineFilenameComments = [];
	var comment = '';
	var abs;

	// iterate over all lines
	lines.forEach(function(lineContent, i) {
		lineFilenameComments = [];

		// replace url() calls in current line
		lineContent = lineContent.replace(/url\(\s*['"]?([^'"\)#?]+)(?:[#?](?:[^'"\)]*))?['"]?\s*\)/gm, function (match, src) {
			abs = (this.options.abs != null) ? this.options.abs : null;

			// dont replace empty matches
			if (src.length < 1 || src === "/") {
				return match;
			}

			// don't replace:
			// - external media references (http:// or https://)
			// - base64 data
			if (this.isHttpFile(src) || this.isBase64Data(src)) {
				return match;	
			}

			var filename = src.replace(/^.*[\\\/]/, '').replace(/\.[^/.]+$/, "");
			var uuid = this.replaceSpecialChars(filename).toLowerCase();

			// get filemapping configuration for file
			var fileMappingConfig = (function() {
				if (!this.options.hasOwnProperty('fileMapping') || typeof this.options.fileMapping  !== 'object') {
					return false;
				}
				return this.options.fileMapping[src];
			}.bind(this))();
			
			if (typeof fileMappingConfig === 'string') {
				// short configuration syntax detected, overwrite default reference name
				uuid = fileMappingConfig;
			}

			if (typeof fileMappingConfig === 'object') {
				// long configuration syntax, check for reference name config
				if (typeof fileMappingConfig.referenceName === 'string') {
					uuid = fileMappingConfig.referenceName;
				}

				// check for abs configuration
				if (typeof fileMappingConfig.abs !== 'undefined') {
					abs = fileMappingConfig.abs;
				}
			}

			var absString = '';
			// add abs cms_ref configuration when greate than 0
			if (abs != null) {
				absString = ', abs:'+abs
			}
			
			var cmsRef = match.replace(src, '$CMS_REF(media:"' + uuid + '"' + absString + ')$');
			
			if (this.options.addFilenameComment) {
				lineFilenameComments.push(uuid + ' = ' + src);	
			}

			return cmsRef;
    }.bind(this));

    // create comment string for the current line
    if (lineFilenameComments.length > 0) {
    	comment = lineFilenameComments.join(', ');
    	comment = ' /* ' + comment + ' */';
    } else {
    	comment = '';
    }

		// write new lineContent to back lines array
    lines[i] = lineContent + comment;
	}.bind(this));

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

