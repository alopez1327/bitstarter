#!/usr/bin/env node

/*
Automatically grade files for the presence of specified
HTML tags/attributes. Uses commander.js and cheerio. Teaches
command line application development and basic DOM parsing.

References:

+ cheerio
- https://github.com/MatthewMueller/cheerio
- http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
- http://maxogden.com/scraping-with-node.html

+ commander.js
- https://github.com/visionmedia/commander.js
-http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

+ JSON
- http://en.wikipedia.org/wiki/JSON
- https://developer.mozilla.org/en-US/docs/JSON
- https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

// Define defaults for the input parameters
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";

// Load the required libraries
var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var rest = require('restler');

// Function definitions
var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        // http://nodejs.org/api/process.html#process_proces s_exit_code
        process.exit(1);
    }
    return instr;
};

var assertUrlExists = function(inurl) {
    var instr = inurl.toString();

    // How to check if a url exists?
    console.log(instr);
    
    return instr;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};

    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

// In commander using <req> means the parameter is required, using
// [opt] means the arameter is optional.
// The format is 'flags', 'description', arbitrary function, default
// options  

if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json',
				clone(assertFileExists), CHECKSFILE_DEFAULT)        
        .option('-f, --file <html_file>', 'Path to index.html',
				clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-u, --url <url>', 'An url')
        .parse(process.argv);
        
    // Before calling checkHtmlFile need to get either a file or
    // read the contents of a URL into a file, give priority to
    // passing an URL as a parameter
    if (program.url) {
		var theUrl = program.url;              
        rest.get(theUrl).on('complete',function(result, response){
			if (result instanceof Error) {
				console.error('Error: ' + util.format(response.message));
			} else {
				// Not efficient but it will work
				fs.writeFileSync("tmp.file", result);
				var checkJson = checkHtmlFile("tmp.file", program.checks);
				var outJson = JSON.stringify(checkJson, null, 4);
				console.log(outJson);
			}
		});
    } else {
		// Note how most of the code is replicated. This is an inneficient but
		// easy solution to the asynchronous nature of the rest.get function
		// will see if I can get a more efficient solution later.
		var checkJson = checkHtmlFile(program.file, program.checks);
		var outJson = JSON.stringify(checkJson, null, 4);
		console.log(outJson);
    }
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
