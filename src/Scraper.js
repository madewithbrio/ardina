var config    = require('./config/config.js').config,
    db        = require('mongoose').createConnection(config.mongodb.dsn, config.mongodb.options),
    request   = require('request'),

//    zlib      = require('zlib'),
//    fs        = require('fs'),
    
    Gearman   = require('node-gearman'),
    gearClient= new Gearman(config.gearman.host, config.gearman.port),

    winston   = require('winston'),
    jsdom     = require("jsdom"),
    selectors = require('./config/Selectors.js'),
    StringHelper = require('./lib/StringHelper.js');
    require('./lib/ArticleSchema.js');

try {
  winston.info('start worker process');
  gearClient.connect();
  db.on('error', function(err){ winston.error(err); });
  db.once('open', function () { winston.log("connect to db"); });
  var Article   = db.model('Article');
} catch (e) {
  throw e;
}


/**
 * Worker configuration
 */
gearClient.registerWorker('scraper', function(payload, worker) {

  /* something weird happened? */
  /* @TODO: improve error handling */
  if (!payload) {
    worker.error();
    return;
  }

    /* parse data */
  var data       = JSON.parse(payload);
  winston.info('processing ', JSON.stringify(data));

  var callback = function (err, res) {
    if (res !== undefined) {
      if (err) {
        winston.error(' ', JSON.stringify(res));
        worker.error(res);
      } else {
        winston.info('ended: ', JSON.stringify(res));
        worker.end(res);
      }
    } else {
      worker.error();
    }
  };

  Article.count({sourceUrl: data.url}, function(err, count) {
    if (err) return callback(err, 'fail find if article allready scraped');
    if (count !== 0) return callback(true, 'article allready scraped');

    var selector = selectors.getSelector(data.url);
    if (typeof selector === 'undefined') return callback(true, 'site dont have selector');
    try {
      scraperNewsArticle(data.url, selector, data.tags, callback);
    } catch (e) {
      return callback(true, 'fail scrap page: ' + e);
    }
  });  
});


/**
 *  Scrape article page using dom parser and jquery selectores
 */
var scraperNewsArticle = function(url, selector, tags, callback) 
{
  request({ 
    url: url, timeout: 10000 , headers: { 'accept-charset': 'utf8' } 
  }, function (error, response, body) {
    if (error && response.statusCode !== 200) {
      return callback(true, 'Error when contacting server');
    }

    jsdom.env({
      html: body, 
      scripts: ["http://code.jquery.com/jquery.js"] /* todo use local jquery */
    }, function (err, window) {
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
        return callback(true, 'Fail scrap page selectores dont found any data');
      }
      if (img != null && !img.match(/^http:\/\//)) 
      { 
        img = selector.host + img.replace(/^\//, '');
      }
      winston.info('img: '+img);

      // build object to save
      var article = new Article({
        title:      title,
        lead:       lead,
        body:       body,
        image:      {
          url:          img,
          description:  imgCap,
          author:       imgAut
        },
        tags:       tags,
        author:     author,
        source:     selector.source,
        sourceUrl:  url,
      });

      // save article in db
      article.save(function (err, obj) {
        if (err) return callback(true, 'Fail save page: '+err);
        callback(false, 'page scraped');
      });
    });
  });
}