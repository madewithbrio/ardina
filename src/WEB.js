var config 			= require('./config/config.js').config,
	fs 				= require('fs'),
	mkdirp 			= require('mkdirp'),
	db  			= require('mongoose').createConnection(config.mongodb.dsn, config.mongodb.options),
	http			= require('http'),
    winston			= require('winston'),
    journey			= require('journey'),
    request 		= require('request'),
    View 			= require('./lib/View.js'),
    async 			= require('async');
    require('./lib/ArticleSchema.js');

var WEB = function()
{
	this.init();
};

WEB.cachePage = function(content, pagename)
{
	if (!config.web.storePage) return; // cache not actived
	var location = config.web.cache + pagename.replace(/\/[^\/]+$/, '');
	if (!fs.exists(location)){
		mkdirp.sync(location);
	}

	fs.writeFile(config.web.cache + pagename, content, function(err) {
	    if(err) {
	        winston.error("fail store page: " + err);
	    } else {
	    	winston.info("page cache stored " + pagename);
	    }
	}); 
};

WEB.prototype = {
	/**
	* initialization
	*/
	init : function ()
	{
		winston.info("start service ...");
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

		}).listen(config.web.port, config.web.ip);
		winston.info("service listen on " + config.web.ip + ":" + config.web.port);
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

	    router.get(/^\/artigo\/(.+)$/).bind(function (request, slug, params) {
	    	slug = '/'+slug;
		    db.model('Article').findBySlug(slug, function(err, data){
		    	if (err) {
    				return request.send(500, {}, { status : false, error : 'Could not fetch article' });
    			} else {
    				var view = new View();
    				view.assign('has_font_resizer', true);
    				view.renderView('article_detail', data, function(content) {
    					request.send(200, {'Content-Type': 'text/html'}, content);
    					WEB.cachePage(content, slug);
    				});
    			}
		    });
		});

	    router.get(/^\/related\/(.+)$/).bind(function (request, slug, params) {
	    	slug = '/'+slug;
		    db.model('Article').findBySlug(slug, function(err, data){
		    	if (err) {
    				return request.send(500, {}, { status : false, error : 'Could not fetch article' });
    			} else {
    				var keywords = KeywordsAnaliser.getKeywords(data.analiser);
					var relatedArticles = db.model('Article').findReleated(keywords, function(err, data){
						var view = new View();
						view.assign('has_font_resizer', true);
						view.renderTemplate('articles_list', data, function(content) {
							request.send(200, {'Content-Type': 'text/html'}, content);
						});
					});
    			}
		    });
		});

	    router.get(/^\/(desporto|politica|economia|sociedade|tec_ciencia|cultura)\/?$/).bind(function (request, category) {
			try {
				var Article = db.model('Article'), data = {};

				async.parallel({
				   highlights : function(cb){
				   		Article.findHighligts([category],cb);
				   },
				   latested : function(cb){
				   		Article.findLatested([category],cb);
				   }
				}, function(err,data){
				   if (err) {
	    				return request.send(500, {}, { status : false, error : 'Could not fetch article' });
	    			} else {
	    				var view = new View();
	    				view.renderView('homepage', data, function(content) {
	    					request.send(200, {'Content-Type': 'text/html'}, content);
	    					delete view;
	    				});
	    			}
				});
			} catch (e) {
				return request.send(500, {}, { status : false, error : 'sorry we can`t help you now' });
			}

		});

		router.get(/^\/$/).bind(function (request) {
			try {
				var Article = db.model('Article'), data = {};

				async.parallel({
				   highlights : function(cb){
				      Article.findHighligts(['destaques'], cb);
				   },
				   latested : function(cb){
				      Article.findLatested(cb);
				   }
				}, function(err,data){
				   if (err) {
	    				return request.send(500, {}, { status : false, error : 'Could not fetch article' });
	    			} else {
	    				var view = new View();
	    				view.renderView('homepage', data, function(content) {
	    					request.send(200, {'Content-Type': 'text/html'}, content);
	    					delete view;
	    				});
	    			}
				});
			} catch (e) {
				return request.send(500, {}, { status : false, error : 'sorry we can`t help you now' });
			}

		});

	    return router;
	}
};

new WEB();
