var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/www')); //dossier public


app.get('/', function(req, res) {
	res.sendFile('www/index.html');
});

app.listen(app.get('port'), function() {
	console.log("Pac man is listening on port " + app.get('port'));
});
