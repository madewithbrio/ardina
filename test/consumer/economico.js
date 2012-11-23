var rss = require('./lib/node-rss');
var execSync = require('exec-sync');

var feed_url = 'http://economico.sapo.pt/rss/ultimas';
var response = rss.parseURL(feed_url, function(articles) {
    console.log("number of articles: " + articles.length + "\n");
    for(i=0; i<articles.length; i++) {
		if (typeof articles[i].link === 'string') {
			console.log("Article: " + i + ", " + articles[i].link + " \n");
			var command = "node ../parser/Scraper.js '" + articles[i].link +"' 'economia'";
			try {
				var res = execSync(command);
			} catch (e) {
				console.log("fail: " +e);
			}
		}
    }
});
