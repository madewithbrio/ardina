var config    	= require('../config/config.js').config,
	rss 		= require('../lib/RSSReader.js'),
    Gearman   	= require('node-gearman'),
    gearClient 	= new Gearman(config.gearman.host, config.gearman.port),
    winston   	= require('winston'),
    RSSConf 	= config.feed.expresso_tec,
    last_link 	= undefined;

var load_feed = function(){
	winston.info("read feed: " + RSSConf.source);
	rss.parseURL(RSSConf.source, function(articles) {

	    winston.info("number of articles: " + articles.length);
	    for(i=0; i<articles.length; i++) {
	    	if (articles[i].link === last_link){
	    		winston.info("nothing more to process");
	    		break; // allready have process to this point
	    	} 
			if (typeof articles[i].link === 'string') {
				winston.info("send page to scrap to queue " + articles[i].link);
				var data = {url: articles[i].link, tags: ['tec_ciencia'], pubDate: articles[i].pubdate, update: true};
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
	setTimeout(load_feed, RSSConf.refresh);
};
load_feed();
