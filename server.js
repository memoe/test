var express = require('express'); // require express
var app = express(); // launch express app
var port = process.env.PORT || 8080;  // set port to either environment variable or to 8080
var mongoose = require('mongoose');

var bodyParser = require('body-parser');  // read form data

// ==============================================================================
// Configuration

app.use(bodyParser.json()); // form reader, call individual properties of bodyParser such as
app.use(bodyParser.urlencoded({
	extended: true
}));
// urlenconded() with explicit specifing extended to be true, or json()
app.use('/js', express.static(__dirname + '/app/js')); // place static files in public
app.use('/css', express.static(__dirname + '/app/css')); // place static files in public
app.use(express.static('/app')); // place static files in public

// database ======================================================================
var mongooseURI = process.env.MONGOLAB_URI ||
	process.env.MONGOHQ_URL ||
	'mongodb://localhost/test';

mongoose.connect(mongooseURI);

// define schema
var reviewSchema = mongoose.Schema({
	title: String,
	isbn: String,
	author: String,
	review: String,
	genres: [String]
});

// compile model
var Books = mongoose.model('Books', reviewSchema);

// api ==============================================================================


// get data
app.get('/api/reviews', function(req,res) {

	console.log("Request for data received.");

	Books.find(function(err, data) {
		// return data
		res.json(data);
	});
});

// post review
app.post('/api/reviews', function(req, res) {
	console.log("Post request received.");
	//console.log(req.body);

	Books.create(req.body, function(err, data) {
		console.log("inside create request");
		
		Books.find(function(err, send) {
			// return data
			console.log("Return data: " + send);
			res.json(send);
		});
	});
});


// dete review
app.delete('/api/reviews/:id', function(req, res) {
	console.log("Delete entry " + req.params.id);

	Books.remove({
		_id: req.params.id
	}, function(err, data) {
		console.log("Data deleted");

		Books.find(function(err, data) {
			// return data
			console.log("Return data");
			res.json(data);
		});
	})
})



// routes ========================================================================
require('./routes.js')(app); // pass app object in route class

// launch ========================================================================
app.listen(port);
console.log("App started on port " + port);