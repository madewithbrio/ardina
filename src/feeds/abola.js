var config    	= require('../config/config.js').config,
	rss 		= require('../lib/RSSReader.js'),
    Gearman   	= require('node-gearman'),
    gearClient 	= new Gearman(config.gearman.host, config.gearman.port),
    winston   	= require('winston'),
    RSSConf 	= config.feed.abola,
    last_link 	= undefined;

var load_feed = function(){
	winston.info("read feed: " + RSSConf.source);
	rss.parseURL(RSSConf.source, function(articles) {

	    winston.info("number of articles: " + articles.length);
	    for(i=0; i<articles.length; i++) {
	    	if (articles[i].guid === last_link){
	    		winston.info("nothing more to process");
	    		break; // allready have process to this point
	    	} 
			if (typeof articles[i].guid === 'string') {
				winston.info("send page to scrap to queue " + articles[i].guid);
				var data = {url: articles[i].guid, tags: ['desporto', articles[i].category], pubDate: articles[i].pubdate, update: false};
				var job = gearClient.submitJob('scraper', JSON.stringify(data))
				job.on('error', function(err){
					winston.error(err);
				}).on('end', function(){
					winston.info("job done");
					delete job;
				});
			}
	    }
	    last_link = articles[0].guid;
	    articles = undefined;
	    delete articles;
	});
	setTimeout(load_feed, RSSConf.refresh);
};
load_feed();
