var config = {
  /* GEARMAN */
  gearman : {
    host    : '127.0.0.1',
    port    : 4730,
    maxPush : 10
  },

  /* MONGODB */
  mongodb : {
    dsn     : 'mongodb://localhost/ardina',
    options : { server: { auto_reconnect: true, poolSize: 5 }}
  },

  /* API */
  api : {
    port      : 3001,
    ip        : '127.0.0.1',
  },

  web : {
    port      : 3002,
    ip        : '127.0.0.1',
    templates : '../templates',
    storePage : true,
    cache     : '/var/tmp/ardina/cache'
  },

  feed : {
    abola                 : { source : 'http://rss.feedsportal.com/c/32502/f/480420/index.rss', refresh: 120000 },
    economico             : { source : 'http://economico.sapo.pt/rss/ultimas', refresh: 120000 },
    sol                   : { source : 'http://sol.sapo.pt/rss/', refresh: 120000 },
    expresso_destaques    : { source : 'http://expresso.sapo.pt/manchetes_feed.rss', refresh: 60000 },
    expresso_economia     : { source : 'http://expresso.sapo.pt/static/rss/economia_23413.xml', refresh: 240000 },
    expresso_desporto     : { source : 'http://expresso.sapo.pt/static/rss/desporto_23414.xml', refresh: 240000 },
    expresso_tec          : { source : 'http://expresso.sapo.pt/static/rss/tecnologia-e-ciencia_24924.xml', refresh: 300000 },
    expresso_geral        : { source : 'http://expresso.sapo.pt/static/rss/atualidade_23412.xml', refresh: 120000 },
    publico               : { source : 'http://feeds.feedburner.com/PublicoRSS', refresh: 120000 },
    sapo_destaques        : { source : 'http://services.sapo.pt/RSS/Feed/noticias/homepage_geral', refresh: 60000 },

    rr_geral              : { source : 'http://rr.sapo.pt/rssFeed.aspx?cid=1', refresh: 120000 },
    rr_politica           : { source : 'http://rr.sapo.pt/rssFeed.aspx?fid=27', refresh: 2400000 },
    rr_economia           : { source : 'http://rr.sapo.pt/rssFeed.aspx?fid=24', refresh: 2400000 },
    rr_cultura            : { source : 'http://rr.sapo.pt/rssFeed.aspx?fid=30', refresh: 2400000 }
  }
}

if (process.env.ENVIRONMENT == 'STG') {
  config.mongodb.dsn = 'mongodb://192.168.2.2/ardina';
}

// from command arguments
var arg_reg_exp = /^--(\w+)=(.*)$/;
for (var i = 0; i < process.argv.length; i++) {
  var argument = arg_reg_exp.exec(process.argv[i]);
  if (argument) {
    switch(argument[1]) {
      /** WEB **/
      case 'web_port':
        config.web.port = argument[2];
      break;
      case 'web_cache':
        config.web.storePage = !(argument[2] == 'false');
      break;
      
      /** API **/
      case 'api_port':
        config.api.port = argument[2];
      break;

      /** FEED **/
      case 'feed_refresh':
        config.feed.refresh = argument[2];
    }
  }
}

exports.config = config;
