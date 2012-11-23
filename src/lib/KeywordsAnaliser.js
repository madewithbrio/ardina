KeywordsAnaliser = function(text) {
	var options = {
		discardWordsWithLessChar: 5,
		keywordReapetedTimes: 	  3,
		stopWords: [
			'entre', 'mesmo', 'depois', 'mas', 'estes', 'apenas', 'segundo', 'ainda', 'sobre', 'muito', 'parte', 'ontem'
		]
	}

	var object = {
		charCount: 		0,
		wordsCount: 	0,
		//words: 			[],
		keywords: 		[],
		//expressions: 	[]
	}

	var __haveStopWord = function(expression) {
		var words = expression.split(" ");
		for (var idx in words) {
			if (options.stopWords.indexOf(words[idx]) != -1) return true;	
		}
		return false;	
	}

	var init = function() { // start and clean text
		var words, word, oWords = {}, keywords = [], i;
		object.charCount = text.length;
		text = text.replace(/\s/g, ' ').toLowerCase().replace(/[^\w\u00E0-\u00FC]/g, ' ');
		words = text.split(' ');
		//object.wordsCount = words.length;

		for (i = 0; i < words.length; i++) {
			word = words[i];
			if (word.length < options.discardWordsWithLessChar) continue;
			if (options.stopWords.indexOf(word) != -1) continue;

			word = word.replace(/ões$/,'ão').replace(/ães$/,'ão').replace(/eis$/,'el').replace(/([aeio])s$/, '$1'); // singular
			if (typeof oWords[word] === 'undefined') {
				object.wordsCount++;
				oWords[word] = 1;
			} else {
				oWords[word]++;
			}
		}

		for (var keyword in oWords) {
			var iNumber = oWords[keyword],
				iWordCount = object.wordsCount,
				fQuotient = Math.round(100 * (iNumber / iWordCount), 2);

			if (iNumber >= options.keywordReapetedTimes) {
				keywords.push({keyword: keyword, repeted: iNumber, quotient: fQuotient});
			}
		}
		keywords.sort(function(a, b) { return b.repeted - a.repeted });
		object.keywords = keywords.slice(0,10);

	/**
		var expressions = text.match(/[\w\u00E0-\u00FC]{4,}[\s]+[\w\u00E0-\u00FC]{1,3}[\s]+[\w\u00E0-\u00FC]{4,}/g);
		for (i = 0; i < expressions.length; i++) {
			if (__haveStopWord(expressions[i])) continue; 
			for (var idx in object.keywords) {
				if (expressions[i].indexOf(object.keywords[idx].keyword) != -1) {
					object.expressions.push(expressions[i]); break;
				}
			}
		}
	**/
	}

	init();
	return object;
};
