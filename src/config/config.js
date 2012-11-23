exports.config = {
  /* GEARMAN */
  gearman : {
    host    : '127.0.0.1',
    port    : 4730,
    maxPush : 3
  },
  /* MONGODB */
  mongodb : {
    dsn     : 'mongodb://localhost/test',
    options : { server: { auto_reconnect: true, poolSize: 5 }}
  },
  /* API */
  api : {
    port : 3001
  },

  feed : {
    refresh : 60000,
    source  : {
      abola     : 'http://rss.feedsportal.com/c/32502/f/480420/index.rss',
      economico : 'http://economico.sapo.pt/rss/ultimas',
      sol       : 'http://sol.sapo.pt/rss/'
    } 
  }
}