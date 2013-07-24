var express = require('express');
var fs = require('fs');

var app = express.createServer(express.logger());

// To give structure to the web app first we need to separate
// the static & public files from the dynamic & private ones
// After reading a lot in the web this is the best solution
//
app.use(app.router);
app.use('/public', express.static(__dirname + '/public/'));

app.get('/', function(request, response) {
//
// Note that now we need to read the index from the public
// folder.
//
    var buffer = fs.readFileSync('./public/index.html');
    response.send(buffer.toString('utf-8'));
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});