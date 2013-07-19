var express = require('express');
var fs = require('fs');

var app = express.createServer(express.logger());

// Use the root and the /media directory, later on
// add a css and js directories to leave the html alone
// However. I'll need to check if this impacts performance
app.use(app.router);
app.use(express.static(__dirname + '/media/'));

app.get('/', function(request, response) {
    var buffer = fs.readFileSync('index.html');
    response.send(buffer.toString('utf-8'));
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});