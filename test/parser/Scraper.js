var request   = require('request'),
    zlib      = require('zlib'),
    fs        = require('fs'),
    jsdom     = require("jsdom"),
    mongoose  = require('mongoose'),
    Iconv     = require('iconv').Iconv,
    Buffer    = require('buffer').Buffer,
    selectors = require('./config/Selectors.js');
    require('./lib/ArticleSchema.js');
var StringHelper = require('../../src/lib/StringHelper.js');
//var url = "http://desporto.publico.pt/noticia.aspx?id=1573292";

var url = process.argv[2];
if (typeof url === 'undefined') 
{
  console.log("need provide url to scrap.");
  throw new Error('no url');
}

var selector = selectors.getSelector(url);
if (typeof selector === 'undefined')
{
  console.log("selector not found or defined");
  throw new Error('no selector');
}

var tags = [];
if (process.argv.length > 3) {
  tags = process.argv.slice(3, process.argv.length);
}

var db = mongoose.createConnection('mongodb://localhost/test', { server: { auto_reconnect: false, poolSize: 1 }});
try {
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function callback () {
    var Article = db.model('Article');
    Article.count({sourceUrl: url}, function(err, count) {
      if (count != 0) {
        throw new Error("article already scraped");
      }
    });
    scraperNewsArticle(url, selector, tags);
  });
} catch (err) {
  console.error(err);
  db.close();
}

/**
 *  Scrape article page using dom parser and jquery selectores
 */
var scraperNewsArticle = function(url, selector, tags) 
{
  request({ 
    url: url, timeout: 10000 /*, headers: { 'accept-encoding': 'gzip, deflate' } */
  }, function (error, response, body) {
    if (error && response.statusCode !== 200) {
      console.error('Error when contacting server');
      throw new Error('Error when contacting server');
    }

    jsdom.env({
      html: body, 
      scripts: ["http://code.jquery.com/jquery.js"] /* todo use local jquery */
    }, function (err, window) {
      // start main objects
      var $         = window.jQuery, 
          Article   = db.model('Article');

      // find element in dom using jquery
      var title     = $(selector.title),
          lead      = $(selector.lead),
          body      = $(selector.body);

      // test if we have found elements
      if (title.length == 0 && lead.length == 0 && body.length == 0) {
        throw new Error("Fail scrap page");
      }

      // build object to save
      var article = new Article({
        title:      title.text().trim(),
        lead:       lead.html() || "",
        body:       body.html() || "",
        image:      {
          url:          $(selector.image.url).attr('src'),
          description:  $(selector.image.description).text(),
          author:       $(selector.image.author).text()
        },
        tags:       tags,
        author:     $(selector.author).text().trim(),
        source:     selector.source,
        sourceUrl:  url,
      });

      // save article in db
      /**
      article.save(function (err, obj) {
        if (err) // TODO handle the error
        {
          throw new Error(err);
        }
        db.close();
      });
      **/
    });
  });
}