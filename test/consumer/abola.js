var rss = require('./lib/node-rss');
var execSync = require('exec-sync');

var feed_url = 'http://rss.feedsportal.com/c/32502/f/480420/index.rss';
var response = rss.parseURL(feed_url, function(articles) {
    console.log("number of articles: " + articles.length + "\n");
    for(i=0; i<articles.length; i++) {
		if (typeof articles[i].guid === 'string') {
			console.log("Article: " + i + ", " + articles[i].guid + " " + articles[i].category + "\n");
			var command = "node ../parser/Scraper.js '" + articles[i].guid +"' desporto '" + articles[i].category.toLowerCase() + "'";
			try {
				var res = execSync(command);
			} catch (e) {
				console.log("fail: " +e);
			}
		}
    }
});
