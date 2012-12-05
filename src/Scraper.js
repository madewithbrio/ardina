var config    = require('./config/config.js').config,
    db        = require('mongoose').createConnection(config.mongodb.dsn, config.mongodb.options),
    http      = require('follow-redirects').http,

//    zlib      = require('zlib'),
//    fs        = require('fs'),
    
    Gearman   = require('node-gearman'),
    gearClient= new Gearman(config.gearman.host, config.gearman.port),

    winston   = require('winston'),
    jsdom     = require("jsdom"),
    selectors = require('./config/Selectors.js');
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
    if (count !== 0 && data.update !== true) return callback(true, 'article allready scraped');

    var selector = selectors.getSelector(data.url);
    if (typeof selector === 'undefined') return callback(true, 'site dont have selector');
    try {
      var options = {tags: data.tags, pubDate: data.pubDate, update: count};
      scraperNewsArticle(data.url, selector, options, callback);
    } catch (e) {
      return callback(true, 'fail scrap page: ' + e);
    }
  });  
});


/**
 *  Scrape article page using dom parser and jquery selectores
 */
var scraperNewsArticle = function(url, selector, options, callback) 
{
  var req = http.request(url, function(res) {
    var page = '';

    if (typeof selector.enconding == 'string') {
      winston.info("set enconding: " + selector.enconding);
      res.setEncoding(selector.enconding);
    }

    // buffer response
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
          callback(err, msg);
        };

        // start main objects
        var $         = window.jQuery, 
            Article   = db.model('Article');

        // find element in dom using jquery
        var $titleEl  = $(selector.title),
            $leadEl   = $(selector.lead),
            $bodyEl   = $(selector.body),
            $dateEl   = $(selector.date),
            $authorEl = $(selector.author),
            $imgEl    = $(selector.image.url),
            $imgCapEl = $(selector.image.description),
            $imgAutEl = $(selector.image.author),
            $tags     = $(selector.tags),
            
            title     = ($titleEl.length)   ? $titleEl.text().trim()    : null,
            //body    = ($bodyEl.length)    ? $bodyEl.html()            : null,
            lead      = ($leadEl.length)    ? $leadEl.html()            : null,
            img       = ($imgEl.length)     ? $imgEl.get(0).src         : null,
            imgCap    = ($imgCapEl.length)  ? $imgCapEl.text()          : null,
            imgAut    = ($imgAutEl.length)  ? $imgAutEl.text()          : null,
            author    = ($authorEl.length)  ? $authorEl.text()          : null;
            date      = ($dateEl.length)    ? new Date($dateEl.text())  : (typeof options.pubDate == 'string' 
                                                                            ? new Date(options.pubDate)
                                                                            : undefined;

        // found tags and append it to options tags
        var tags = options.tags || [];
        $tags.each(function(){ tags.push($(this).text()); });

        // test if we have found elements
        if ($titleEl.length == 0 && $leadEl.length == 0 && $bodyEl.length == 0) {
          return _callback(true, 'Fail scrap page selectores dont found any data');
        }

        if (img != null && !img.match(/^[\w]{3,}:\/\//)) 
        { 
          img = selector.host + img.replace(/^\//, '');
        }
        
        
        // body links
        $bodyEl.find('a').each(function(idx, el){
          var $el = $(el), href= $(el).attr('href');
          if (!href.match(/^[\w]{3,}:\/\//)) {
            $bodyEl.find($(el)).attr('href', selector.host + href.replace(/^\//, ''));
          }
        });
        $bodyEl.find('img').each(function(idx, el){
          var src= $(el).attr('src');
          if (!src.match(/^[\w]{3,}:\/\//)) {
            $bodyEl.find($(el)).attr('src', selector.host + src.replace(/^\//, ''));
          }
        });
        if (typeof selector.exclude_body == 'string') {
          console.log("exclude body "+ selector.exclude_body);
          $bodyEl.find(selector.exclude_body).remove();
        }
        body = $bodyEl.html();

        // save article in db
        var storeCallback = function (err, obj) {
            if (err) return _callback(true, 'Fail save page: '+err);
            _callback(false, 'page scraped');
        };
        if (options.update === 0) {
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
            sourceUrl:  selector.url,
            pubDate:    date
          });

          // store
          article.save(storeCallback);
        } else {
          Article.findOne({sourceUrl: selector.url}, function (err, article){
            if (err) storeCallback(err, 'fail find article to update');
            article.tags = tags;
            article.body = body;
            article.pubDate = date;
            article.save(storeCallback);
          });
        }
      });
    });
  });

  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
    callback(true, e.message);
  });

  req.end(); // execute request
}