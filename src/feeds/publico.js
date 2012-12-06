var config    	= require('../config/config.js').config,
	rss 		= require('../lib/RSSReader.js'),
    Gearman   	= require('node-gearman'),
    gearClient 	= new Gearman(config.gearman.host, config.gearman.port),
    winston   	= require('winston'),
    RSSConf 	= config.feed.publico,
    last_link 	= undefined;

var load_feed = function(){
	winston.info("read feed: " + RSSConf.source);
	rss.parseURL(RSSConf.source, function(articles) {

	    winston.info("number of articles: " + articles.length);
	    for(i=0; i<articles.length; i++) {
	    	if (articles[i].origlink === last_link){
	    		winston.info("nothing more to process");
	    		break; // allready have process to this point
	    	} 
			if (typeof articles[i].origlink === 'string') {
				winston.info("send page to scrap to queue " + articles[i].origlink);
				var category = articles[i].category ? articles[i].category.toLowerCase() : undefined;
				var data = {url: articles[i].origlink, tags: [ category ], pubDate: articles[i].pubdate, update: true};
				var job = gearClient.submitJob('scraper', JSON.stringify(data))
				job.on('error', function(err){
					winston.error(err);
				}).on('end', function(){
					winston.info("job done");
				});
			}
	    }
	    last_link = articles[0].origlink;
	    articles = undefined;
	});
	setTimeout(load_feed, RSSConf.refresh);
};
load_feed();

