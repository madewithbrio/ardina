var mongoose  = require('mongoose'), Schema = mongoose.Schema;
require('./KeywordsAnaliser.js');

var ArticleSchema = new Schema({
    title: 			{ type: String, index: true, required: true, trim: true },
    lead: 			{ type: String },
    body: 			{ type: String },
    image: 			{
      url:          { type: String },
      description:  { type: String },
      author:       { type: String }
    },
    author:     { type: String },
    highlight:  { type: Boolean, default: false },

    source: 		{ type: String, index: true, required: true, trim: true },
    sourceUrl: 	{ type: String, index: true, required: true, unique: true },
    pubDate: 		{ type: Date,  	index: true, required: true },
    tags:       [{type: String}],

    slug:       { type: String, index: true, required: true, unique: true, lowercase: true, trim: true },
    analiser:   {
      charCount:    { type: Number, required: true },
      wordsCount:   { type: Number, required: true },
      keywords:     [{keyword: String, repeted: Number, quotient: Number}]
    },
});

ArticleSchema.path('pubDate').default(function(){
   return new Date()
}).set(function(v){
   return v == 'now' ? new Date() : v;
});

ArticleSchema.statics.findByUrl = function (url, callback) {
  return this.find({ url: url }, callback);
}

ArticleSchema.statics.findBySlug = function (slug, callback) {
  return this.find({ slug: slug }, callback);
}

ArticleSchema.statics.findHighligts = function(callback) {
  return this.find({'image.url' : { $exists : true }}).sort({ pubDate : -1 }).skip(10).limit(6).exec(callback);
}

ArticleSchema.statics.findLatested = function(callback) {
  return this.find({}).sort({ pubDate : -1 }).skip(10).limit(7).exec(callback);
}

function slugGenerator (options){
  options = options || {};
  var key = options.key || 'title';

  function strReplace(str) {
    var l;
    // remove accents, swap ñ for n, etc
    var from = "àáäâèéëêìíïîòóöôùúüûñç";
    var to = "aaaaeeeeiiiioooouuuunc";
    for (var i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }
    return str;
  }

  return function slugGenerator(schema){
    schema.path(key).set(function(v){
      var now             = new Date(),
          year            = now.getUTCFullYear(),
          month           = now.getUTCMonth()+1,
          day             = now.getUTCDate(),
          normalizeTitle  = strReplace(v.toLowerCase()).replace(/[^a-z0-9\s]/g, '').replace(/-+/g, '').replace(/\s+/g, '_');
      this.slug = '/' + year + '/' + month + '/' + day + '/' + normalizeTitle + '.html';
      return v;
    });
  };
};
ArticleSchema.plugin(slugGenerator());

function analiserArticle () {
  return function analiserArticle(schema) {
    schema.path('body').set(function(v) {
      this.analiser = new KeywordsAnaliser(v.replace(/(<([^>]+)>)/ig,""));
      return v;
    });
  };
};
ArticleSchema.plugin(analiserArticle());

mongoose.model('Article', ArticleSchema);