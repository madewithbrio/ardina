var mongoose  = require('mongoose'), Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title: 			{ type: String, index: true, required: true, trim: true },
    lead: 			{ type: String },
    body: 			{ type: String, required: true },
    image: 			{ type: String },
    analiser: 		{
						charCount: 		{ type: Number, required: true },
						wordsCount: 	{ type: Number, required: true },
						keywords: 		[{keyword: String, repeted: Number, quotient: Number}]
					},
    source: 		{ type: String, index: true, required: true, trim: true },
    url: 			{ type: String, index: true, required: true, unique: true },
    slug: 			{ type: String, index: true, required: true, unique: true, lowercase: true, trim: true },
    pubDate: 		{ type: Date,  	index: true, required: true }
});

ArticleSchema.path('pubDate')
.default(function(){
   return new Date()
 })
.set(function(v){
   return v == 'now' ? new Date() : v;
 });

ArticleSchema.statics.findByUrl = function (url, callback) {
  return this.find({ url: url }, callback);
}

function slugGenerator (options){
  options = options || {};
  var key = options.key || 'title';

  return function slugGenerator(schema){
    schema.path(key).set(function(v){
      this.slug = v.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/-+/g, '');
      return v;
    });
  };
};

ArticleSchema.plugin(slugGenerator());

mongoose.model('Article', ArticleSchema);