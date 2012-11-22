var sys = require('sys');
var rss = require('./node-rss');
var execSync = require('exec-sync');

var feed_url = 'http://rss.feedsportal.com/c/32502/f/480420/index.rss';
var response = rss.parseURL(feed_url, function(articles) {
    sys.puts(articles.length);
    for(i=0; i<articles.length; i++) {
		sys.puts("Article: "
			+ i
			+ ", "
			+ articles[i].guid
			+ " "
			+ articles[i].category
			+ "\n"
			);
		var command = "node ../parser/Scraper.js '" + articles[i].guid +"' desporto '" + articles[i].category.toLowerCase() + "'";
		sys.puts(command);
		try {
			var res = execSync(command);
			sys.puts(res);
		} catch (e) {
			sys.puts("fail: " +e);
		}
    }
});
