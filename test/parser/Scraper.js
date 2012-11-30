var http   = require('follow-redirects').http,
    zlib      = require('zlib'),
    fs        = require('fs'),
    jsdom     = require("jsdom"),
    mongoose  = require('mongoose'),
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

function isUtf8(buffer) {
 var length = buffer.length;

 for (var i = 0; i < length; i++) {

  c = buffer[i];

  if (c < 0x80) n = 0;
  else if ((c & 0xE0) == 0xC0) n=1;
  else if ((c & 0xF0) == 0xE0) n=2;
  else if ((c & 0xF8) == 0xF0) n=3;
  else if ((c & 0xFC) == 0xF8) n=4;
  else if ((c & 0xFE) == 0xFC) n=5;
  else return false;

  for (var j = 0; j < n; j++) {
   if ((++i == length) || ((buffer[i] & 0xC0) != 0x80))
    return false;
  }
 }
 return true;
}

/**
 *  Scrape article page using dom parser and jquery selectores
 */
var scraperNewsArticle = function(url, selector, tags) 
{
  var req = http.request(url, function(res) {
    var page = '';
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    if (typeof selector.enconding == 'string') {
      console.log("set enconding: " + selector.enconding);
      res.setEncoding(selector.enconding);
    }

    res.on('data', function (chunk) {
      page += chunk;
    });

    res.on('end', function () {
      jsdom.env({
        html: page, 
        scripts: ["http://code.jquery.com/jquery.js"] /* todo use local jquery */
      }, function (err, window) {
        var _callback = function(err, msg) {
          winston.info("free memory");
          window.close();
          //callback(err, msg);
        };

        // start main objects
        var $         = window.jQuery, 
            Article   = db.model('Article');
        // find element in dom using jquery
        var $titleEl  = $(selector.title),
            $leadEl   = $(selector.lead),
            $bodyEl   = $(selector.body),
            $authorEl = $(selector.author),
            $imgEl    = $(selector.image.url),
            $imgCapEl = $(selector.image.description),
            $imgAutEl = $(selector.image.author),

            
            title     = ($titleEl.length)   ? $titleEl.text().trim() : null,
            body      = ($bodyEl.length)    ? $bodyEl.html()         : null,
            lead      = ($leadEl.length)    ? $leadEl.html()         : null,
            img       = ($imgEl.length)     ? $imgEl.get(0).src      : null,
            imgCap    = ($imgCapEl.length)  ? $imgCapEl.text()       : null,
            imgAut    = ($imgAutEl.length)  ? $imgAutEl.text()       : null,
            author    = ($authorEl.length)  ? $authorEl.text()       : null;
        // test if we have found elements
        if ($titleEl.length == 0 && $leadEl.length == 0 && $bodyEl.length == 0) {
          return _callback(true, 'Fail scrap page selectores dont found any data');
        }
        if (img != null && !img.match(/^http:\/\//)) 
        { 
          img = selector.host + img.replace(/^\//, '');
        }

        if (typeof selector.exclude_body == 'string') {
          console.log("exclude body "+ selector.exclude_body);
          $bodyEl.find(selector.exclude_body).remove();
          body = $bodyEl.html();
        }

        console.log(body);
      });
    });
  });

  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  req.end();
  }