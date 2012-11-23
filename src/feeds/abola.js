var config    	= require('../config/config.js').config,
	rss 		= require('../lib/RSSReader.js'),
    Gearman   	= require('node-gearman'),
    gearClient 	= new Gearman(config.gearman.host, config.gearman.port),
    winston   	= require('winston'),
    feed_url 	= config.feed.source.abola,
    last_link 	= undefined;

setInterval(function(){
	winston.info("read feed: " + feed_url);
	rss.parseURL(feed_url, function(articles) {

	    winston.info("number of articles: " + articles.length);
	    for(i=0; i<articles.length; i++) {
	    	if (articles[i].guid === last_link){
	    		winston.info("nothing more to process");
	    		break; // allready have process to this point
	    	} 
			if (typeof articles[i].guid === 'string') {
				winston.info("send page to scrap to queue " + articles[i].guid);
				var data = {url: articles[i].guid, tags: ['desporto', articles[i].category]};
				var job = gearClient.submitJob('scraper', JSON.stringify(data))
				job.on('error', function(err){
					winston.error(err);
				}).on('end', function(){
					winston.info("job done");
				});
			}
	    }
	    last_link = articles[0].guid;
	    articles = undefined;
	});
}, config.feed.refresh);

