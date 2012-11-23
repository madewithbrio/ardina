var config 			= require('./config/config.js').config,
	db  			= require('mongoose').createConnection(config.mongodb.dsn, config.mongodb.options),
	http			= require('http'),
    winston			= require('winston'),
    journey			= require('journey'),
    request 		= require('request');
    require('./lib/ArticleSchema.js');

var API = function()
{
	this.init();
};

API.prototype = {
	/**
	* initialization
	*/
	init : function ()
	{
		this.createServer();
	},
	/**
	* Creates and starts the server
	*/
	createServer : function ()
	{
		var router = this.createRouting();
		var server = http.createServer(function (request, response) {

		var body   = '';

		winston.info('Incoming Request', { url: request.url });
			request.on('data', function (chunk) {
			body += chunk;
		});

		request.on('end', function () {
			router.handle(request, body, function (route) {
				response.writeHead(route.status, route.headers);
				response.end(route.body);
			});
		});

		}).listen(config.api.port);

		return server;
	},
	/**
	* Creates the routing
	*/
  	createRouting : function ()
  	{
	    var router = new (journey.Router)({
			strict     : false,
			strictUrls : false,
			api        : 'basic'
	    }), self = this;

	    // article collection
	    router.path(/\/api/, function(){
	    	this.get(/findBySlug(.*)$/).bind(function(res,slug) {
	    		db.model('Article').findBySlug(slug, function(err, content){
	    			if (err) {
	    				return res.send(500, {}, { status : false, error : 'Could not fetch article' });
	    			} else {
	    				res.send(200, {}, { status : true , result : content});
	    			}
	    		});
	    	});

	    	this.get(/findById\/(.*)$/).bind(function(res,id) {
	    		db.model('Article').findById(id, function(err, content){
	    			if (err) {
	    				return res.send(500, {}, { status : false, error : 'Could not fetch article' });
	    			} else {
	    				res.send(200, {}, { status : true , result : content});
	    			}
	    		});
	    	});
	    });

	    return router;
	}
};

new API();