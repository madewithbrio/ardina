var     mongoose  = require('mongoose');

ArticleSchema = new mongoose.Schema({
    title: 			{ type: String, index: true, required: true },
    lead: 			{ type: String },
    body: 			{ type: String, required: true },
    image: 			{ type: String },
    analiser: 		{
						charCount: 		{ type: Number, required: true },
						wordsCount: 	{ type: Number, required: true },
						keywords: 		[{keyword: String, repeted: Number, quotient: Number}]
					},
    source: 		{ type: String, index: true, required: true },
    url: 			{ type: String, index: true, required: true, unique: true },
    pubDate: 		{ type: Date, default: Date.now, index: true, required: true }
});