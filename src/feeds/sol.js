var config    	= require('../config/config.js').config,
	rss 		= require('../lib/RSSReader.js'),
    Gearman   	= require('node-gearman'),
    gearClient 	= new Gearman(config.gearman.host, config.gearman.port),
    winston   	= require('winston'),
    feed_url 	= config.feed.source.sol,
    last_link 	= undefined;

var load_feed = function(){
	winston.info("read feed: " + feed_url);
	rss.parseURL(feed_url, function(articles) {

	    winston.info("number of articles: " + articles.length);
	    for(i=0; i<articles.length; i++) {
	    	if (articles[i].link === last_link){
	    		winston.info("nothing more to process");
	    		break; // allready have process to this point
	    	}
			if (typeof articles[i].link === 'string') {
				winston.info("send page to scrap to queue " + articles[i].link);
				var category = articles[i].category ? articles[i].category.toLowerCase() : undefined;
				var data = {url: articles[i].link, tags: [ category ], pubDate: articles[i].pubDate};
				var job = gearClient.submitJob('scraper', JSON.stringify(data))
				job.on('error', function(err){
					winston.error(err);
				}).on('end', function(){
					winston.info("job done");
				});
			}
	    }
	    last_link = articles[0].link;
	    articles = undefined;
	});
	setTimeout(load_feed, config.feed.refresh);
};
load_feed();