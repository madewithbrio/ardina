var cradle = require('cradle'); 

var db = new(cradle.Connection)().database('ardina');

exports.store = function(news) {
	db.save(news, function (err, res) {
		// Handle response
	});
}
