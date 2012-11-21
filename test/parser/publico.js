var request   = require('request'),
    zlib      = require('zlib'),
    fs        = require('fs'),
    jsdom     = require("jsdom")
    mongoose  = require('mongoose');

require('./KeywordsAnaliser.js');
require('./ArticleSchema.js');

var selectors = {
  'http://www.publico.pt/': {
    title:  '#content .noticia-title h2',
    lead:   '#content .noticia-intro blockquote',
    body:   '#main-content .noticia',
    img:    '#content .noticia-img img',
    source: 'publico'
  },

  'http://desporto.publico.pt/': {
    title:  '#ctl00_ContentPlaceHolder1_titulo',
    lead:   '#ctl00_ContentPlaceHolder1_lead',
    body:   '#ctl00_ContentPlaceHolder1_texto',
    img:    '#ctl00_ContentPlaceHolder1_img',
    source: 'publico'  
  },

  'http://www.ionline.pt/': {
    title:  '#op-content-inner .pane-page-title h1',
    lead:   '#op-content-inner div.page-articledetail-entry div.field-item',
    body:   '#op-content-inner div.pane-node-body div.pane-content',
    img:    '#quicktabs-media_article .field-content img',
    source: 'ionline' 
  }
};

//var url = "http://www.publico.pt/Mundo/retirada-queixa-de-blasfemia-contra-menina-paquistanesa-1573217";
var url = "http://desporto.publico.pt/noticia.aspx?id=1573292";
//var url = "http://www.ionline.pt/desporto/benfica-ola-john-garay-evitam-nova-tragedia-grega-na-luz";
//var url = "http://www.ionline.pt/portugal/movimentos-sociais-condenam-violencia-gratuita-indiscriminada-da-policia-no-dia-14";
//var url = "http://www.ionline.pt/portugal/cortes-vao-ter-reflexos-nas-infraestruturas-diz-reitor-da-universidade-porto";

function getSelector() {
  for (var host in selectors) {
    if (url.indexOf(host) == 0) {
      return selectors[host];
    }
  }
  return undefined;
}
/*
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  // yay!
});
*/
request({ 
  url: url, 
  timeout: 10000,
  headers: { 'accept-encoding': 'none' }
}, function (error, response, body) {

  if (error && response.statusCode !== 200) {
    console.log('Error when contacting server')
  }

  jsdom.env({
    html: body,
    scripts: ["http://code.jquery.com/jquery.js"]
  }, function (err, window) {
    var selector = getSelector();
    if (selector == undefined) return;

    var $ = window.jQuery,
        lead = $(selector.lead),
        body = $(selector.body);

    var db = mongoose.createConnection('mongodb://localhost/test', { server: { auto_reconnect: false }});
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function callback () {
      var Article = db.model('Article', ArticleSchema);

      var article = new Article({
        title:    $(selector.title).text().trim(),
        lead:     lead.html().trim(),
        body:     body.html().trim(),
        image:    $(selector.img).attr('src'),
        analiser: new KeywordsAnaliser(lead.text().trim() + body.text().trim()),
        source:   selector.source,
        url:      url,
        pubDate:  new Date()
      });

      //console.log(article);
      article.save(function (err, obj) {
        console.log(err);
        if (err) // TODO handle the error
          console.log(obj);
      });
      db.close();
    });


  });
});
