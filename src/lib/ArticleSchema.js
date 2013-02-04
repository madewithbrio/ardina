var mongoose  = require('mongoose'), Schema = mongoose.Schema, StringHelper = require('./StringHelper.js');
require('./KeywordsAnaliser.js');

var months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

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
    tags:       [{type: String, lowercase: true, trim: true}],

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


ArticleSchema.virtual('formatDate').get(function () {
  var date = new Date(this.pubDate);
  var hours   = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  return date.getUTCDate() + " " + months[date.getUTCMonth()] + " " + date.getUTCFullYear() + " // " + hours + ":" + minutes;
});

ArticleSchema.virtual('lead_text').get(function () {
  var lead = typeof this.lead == 'string' ? StringHelper.trim(StringHelper.stripTags(this.lead)) : false;
  if (!lead) {
    lead = StringHelper.trim( StringHelper.stripTags(this.body) );
  }
  return StringHelper.shortString(lead, 250);
});

ArticleSchema.statics.findByUrl = function (url, callback) {
  return this.findOne({ url: url }, callback);
}

ArticleSchema.statics.findBySlug = function (slug, callback) {
  return this.findOne({ slug: slug }, callback);
}

ArticleSchema.statics.findHighligts = function(tags, callback) {
  if (typeof tags == 'function') { callback = tags; tags = undefined; }
  var filter = {'image.url' : { $ne : null }};
  if (typeof tags == 'object') { filter.tags = {$all: tags}};

  return this.find(filter).sort({ pubDate : -1 }).limit(9).exec(callback);
}

ArticleSchema.statics.findLatested = function(tags, callback) {
  if (typeof tags == 'function') { callback = tags; tags = undefined; }
  var filter = {};
  if (typeof tags == 'object') { filter.tags = {$all: tags}};
  return this.find(filter).sort({ pubDate : -1 }).limit(12).exec(callback);
}

ArticleSchema.statics.findReleated = function(keywords, callback) {
  return this.find({"analiser.keywords.keyword": {$in: keywords}}).sort({ pubDate : -1 }).limit(5).exec(callback);
}

function slugGenerator (options){
  options = options || {};
  var key = options.key || 'title';

  return function slugGenerator(schema){
    schema.path(key).set(function(v){
      var now             = new Date(),
          year            = now.getUTCFullYear(),
          month           = now.getUTCMonth()+1,
          day             = now.getUTCDate(),
          normalizeTitle  = StringHelper.removeAccentedChars(v.toLowerCase()).replace(/[^a-z0-9\s]/g, '').replace(/-+/g, '').replace(/\s+/g, '_');
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
