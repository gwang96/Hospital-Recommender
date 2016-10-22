var express = require('express')
var app = express()
var sqlite = require('sqlite3')
var db = new sqlite.Database('data.db')
var querystring = require('querystring')
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    } else {
        next();
    }
};
app.use(allowCrossDomain);

app.get('/', function(req, res) {
    res.send("This server is working. Query at /api?drg=###&zip=#####.")
})
app.get('/api', function(request, response) {
	var drg = '%'
	var zip = '%'
    if (request.query.drg)
        drg = request.query.drg;
    if (request.query.zip)
    	zip = request.query.zip;
    var json = null
    db.serialize(function() {
        db.all('Select "Provider Name", "Provider Street Address",' +
            '"Provider City", "Provider State", "Provider Zip Code",' +
            '"Total Discharges", "Average Total Payments"' +
            'From disease where "DRG Number" = ' + 1 + 
            ' and "Provider Zip Code = "' + zip,
            function(err, rows) {
                response.send(rows)
            });
    })
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Listening on port 3000");
});
