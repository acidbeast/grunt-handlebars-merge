/*
 * grunt-concat-handlebars
 * http://gruntjs.com/
 *
 * Copyright (c) 2016 Dmitry Shlepkin, contributors
 * Licensed under the MIT license.
 */

'use strict';
var chalk = require('chalk');



// var nsdeclare = require('nsdeclare');

module.exports = function(grunt) {


	var _ = grunt.util._;


	// content conversion for templates
	var defaultProcessContent = function(content) { return content; };


	// filename conversion for templates
	var defaultProcessName = function(name) { return name; };


	// filename conversion for partials
	var defaultProcessPartialName = function(filepath) {
		var pieces = _.last(filepath.split('/')).split('.');
		var name   = _(pieces).without(_.last(pieces)).join('.'); // strips file extension
		if (name.charAt(0) === '_') {
			name = name.substr(1, name.length); // strips leading _ character
		}
		return name;
	};


	var minify = function(input){
		"use strict";
	    return input
	        //get rid of duplicate whitespace
	        .replace(/[\s][\s]*/gi, " ")

	        // remove whitespace before the ">" of a tag
	        .replace(/[\s]*>/gi, ">")

	        // remove whitespace after the start of a tag
	        .replace(/>[\s]*/gi, ">")

	        //remove whitespace before the close of a tag
	        .replace(/[\s]*</gi, "<")

	        //the previous removal may have turned {{> partial}} into {{>partial}}
	        // that's bad. undo it.
	        .replace(/{{2}>/gi, "{{> ")

	        //remove whitespace after the "<" of a tag
	        .replace(/<[\s]/gi, "<");
	};


	var clearDoubleSpaces = function(input) {
	    return input.replace(/[\s][\s]*/gi, " ");
	}


	var clearHtmlComments = function (input) {
		return input.replace(/<!--(.*?)-->/,"");
	}


	var clearHandlebarsComments = function (input) {
		return input.replace(/{{!--(.*?)--}}/, "");
	}


	var replaceSingleQuotes = function(input) {
		return input
			.replace(/\'/g, '"');
	};

	var replaceDoubleQuotes = function(input) {
		return input
			.replace(/\"/g, "'");
	};


	grunt.registerMultiTask('hbsmerge', 'Compile handlebars templates and partials.', function() {


		var options = this.options({
			namespace: 'Templates',
			separator: grunt.util.linefeed + grunt.util.linefeed,
			knownHelpers: [],
			minify: false,
			knownHelpersOnly: false,
			clearHtmlComments: true,
			clearHandlebarsComments: true,
			templateQuotes: 2
		});

		
		var processContent = options.processContent || defaultProcessContent;
		var processName = options.processName || defaultProcessName;
		var processPartialName = options.processPartialName || defaultProcessPartialName;
		var filesCount = 0;
		var output = "this['" + options.namespace + "'] = this['" + options.namespace + "'] || {};" ;


		// Assign regex for partials directory detection
		var partialsPathRegex = options.partialsPathRegex || /./;


		// Assign regex for partial detection
		var isPartialRegex = options.partialRegex || /^_/;


		this.files.forEach(function(f) {



			f.src.filter(function(filepath) {
				// Warn on and remove invalid source files (if nonull was set).
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Source file "' + filepath + '" not found.');
					return false;
				}
				return true;
			}).forEach(function(filepath) {


				var src = processContent(grunt.file.read(filepath), filepath);


				/* Minify Template */
				var compiledTemplate = clearDoubleSpaces(src);
				

				if(options.minify){
					var compiledTemplate = minify(compiledTemplate);
				}


				/* Clear HTML Comments */
				if(options.clearHtmlComments) {
					compiledTemplate = clearHtmlComments(compiledTemplate);
				}


				/* Clear */
				if(options.clearHandlebarsComments) {
					compiledTemplate = clearHandlebarsComments(compiledTemplate);
				}


				/* Replace double quotes with single quotes */
				if(options.templateQuotes == 1) {
					compiledTemplate = replaceDoubleQuotes(compiledTemplate);
				}


				/* Replace double quotes with single quotes */
				if(options.templateQuotes == 2) {
					compiledTemplate = replaceSingleQuotes(compiledTemplate);
				}				


				if (partialsPathRegex.test(filepath) && isPartialRegex.test(_.last(filepath.split('/')))) {
					var filename = processPartialName(filepath);
					if(options.templateQuotes == 1) {
						output += 'Handlebars.registerPartial("' + filename + '" , "' + compiledTemplate + '"); ';
					}
					if(options.templateQuotes == 2) {
						output += "Handlebars.registerPartial('" + filename +"' , '" + compiledTemplate + "'); ";
					}
				}
				else {
					var filename = processName(filepath);
					if(options.templateQuotes == 1) {
						output += 'this["' + options.namespace + '"]["' + filename +'"] = "' + compiledTemplate + '";';
					}
					if(options.templateQuotes == 2) {
						output += "this['" + options.namespace + "']['" + filename +"'] = '" + compiledTemplate + "';";
					}
				}


				filesCount++;


			});


			grunt.file.write(f.dest, output);
			grunt.verbose.writeln('File ' + chalk.cyan(f.dest) + ' created.');			


		});	


	});
};
