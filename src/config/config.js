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
    refresh : 60000,
    source  : {
      abola     : 'http://rss.feedsportal.com/c/32502/f/480420/index.rss',
      economico : 'http://economico.sapo.pt/rss/ultimas',
      sol       : 'http://sol.sapo.pt/rss/',
      expresso_destaques : 'http://expresso.sapo.pt/manchetes_feed.rss',
      publico   : 'http://feeds.feedburner.com/PublicoRSS',
      sapo_destaques : 'http://services.sapo.pt/RSS/Feed/noticias/homepage_geral'
    } 
  }
}

if (process.env.ENVIRONMENT == 'STG') {
  config.mongodb.dsn = 'mongodb://192.168.1.74/ardina';
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