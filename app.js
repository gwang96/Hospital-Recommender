var express = require('express')
var app = express()
var sqlite = require('sqlite3')
var db = new sqlite.Database('data.db')
var querystring = require('querystring')
app.get('/', function(request, response) {
    var drg = request.query.drg;
    var json = null
    db.serialize(function() {
        db.all('Select "Provider Name", "Provider Street Address",' +
            '"Provider City", "Provider State", "Provider Zip Code",' +
            '"Total Discharges", "Average Total Payments"' +
            'From disease where "DRG Number" = ' + 1,
            function(err, rows) {
                response.send(rows)
            });
    })
});

app.listen(3000, function () {
	console.log("Listening on port 3000");
});
