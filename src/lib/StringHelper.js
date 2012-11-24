
var StringHelper = function() {};
StringHelper.prototype  = {

    /**
     * @property {Array} ?
     *
     */
    _chars: ['&','à','á','â','ã','ä','å','æ','ç','è','é',
            'ê','ë','ì','í','î','ï','ð','ñ','ò','ó','ô',
            'õ','ö','ø','ù','ú','û','ü','ý','þ','ÿ','À',
            'Á','Â','Ã','Ä','Å','Æ','Ç','È','É','Ê','Ë',
            'Ì','Í','Î','Ï','Ð','Ñ','Ò','Ó','Ô','Õ','Ö',
            'Ø','Ù','Ú','Û','Ü','Ý','Þ','€','\"','ß','<',
            '>','¢','£','¤','¥','¦','§','¨','©','ª','«',
            '¬','\xad','®','¯','°','±','²','³','´','µ','¶',
            '·','¸','¹','º','»','¼','½','¾'],

    /**
     * @property {Array} ?
     *
     */
    _entities: ['amp','agrave','aacute','acirc','atilde','auml','aring',
                'aelig','ccedil','egrave','eacute','ecirc','euml','igrave',
                'iacute','icirc','iuml','eth','ntilde','ograve','oacute',
                'ocirc','otilde','ouml','oslash','ugrave','uacute','ucirc',
                'uuml','yacute','thorn','yuml','Agrave','Aacute','Acirc',
                'Atilde','Auml','Aring','AElig','Ccedil','Egrave','Eacute',
                'Ecirc','Euml','Igrave','Iacute','Icirc','Iuml','ETH','Ntilde',
                'Ograve','Oacute','Ocirc','Otilde','Ouml','Oslash','Ugrave',
                'Uacute','Ucirc','Uuml','Yacute','THORN','euro','quot','szlig',
                'lt','gt','cent','pound','curren','yen','brvbar','sect','uml',
                'copy','ordf','laquo','not','shy','reg','macr','deg','plusmn',
                'sup2','sup3','acute','micro','para','middot','cedil','sup1',
                'ordm','raquo','frac14','frac12','frac34'],

    /**
     * @property {Array} ?
     *
     */
    _accentedChars:['à','á','â','ã','ä','å',
                    'è','é','ê','ë',
                    'ì','í','î','ï',
                    'ò','ó','ô','õ','ö',
                    'ù','ú','û','ü',
                    'ç','ñ',
                    'À','Á','Â','Ã','Ä','Å',
                    'È','É','Ê','Ë',
                    'Ì','Í','Î','Ï',
                    'Ò','Ó','Ô','Õ','Ö',
                    'Ù','Ú','Û','Ü',
                    'Ç','Ñ'],

    /**
     * @property {Array} ?
     */
    _accentedRemovedChars:['a','a','a','a','a','a',
                           'e','e','e','e',
                           'i','i','i','i',
                           'o','o','o','o','o',
                           'u','u','u','u',
                           'c','n',
                           'A','A','A','A','A','A',
                           'E','E','E','E',
                           'I','I','I','I',
                           'O','O','O','O','O',
                           'U','U','U','U',
                           'C','N'],
    /**
     * @property {Object} ?
     * Chars that have sepcial meaning in html and should be escaped.
     */
    _htmlUnsafeChars:{'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'},

    /**
     * @function {String} ?
     * Convert first letter of a word to upper case <br />
     * If param as more than one word, it converts first letter of all words that have more than 2 letters
     *
     * @param {String} string
     * @return {String} string camel case
     */
    ucFirst: function(string)
    {
        return string ? String(string).replace(/(^|\s)(\w)(\S{2,})/g, function(_, $1, $2, $3){
            return $1 + $2.toUpperCase() + $3.toLowerCase();
        }) : string;
    },

    /**
     * @function {String} ?
     * Remove spaces and new line from biggin and ends of string
     * @param {String} string
     * @return string trimmed
     */
    trim: function(string)
    {
        if(typeof(string) == 'string') {
            return string.replace(/^\s+|\s+$|\n+$/g, '');
        }
        return string;
    },

    /**
     * @function {String} ?
     * Remove HTML tags of string
     * @param {String} string
     * @param {optional String} strip tagNames separated by comma ","
     * @return  without HTML tag
 var myvar='isto e um texto <b>bold</b> com imagem <img src=""> e br <br /> um <p>paragrafo</p>'; SAPO.Utility.String.stripTags(myvar, 'b,u');
     */
    stripTags: function(string, allowed)
    {
        if(allowed && typeof allowed == 'string') {
            var aAllowed = this.trim(allowed).split(',');
            var aNewAllowed = [];
            var cleanedTag = false;
            for(var i=0; i < aAllowed.length; i++) {
                if(this.trim(aAllowed[i]) != '') {
                    cleanedTag = this.trim(aAllowed[i].replace(/(\<|\>)/g, '').replace(/\s/, ''));
                    aNewAllowed.push('(<'+cleanedTag+'\\s[^>]+>|<(\\s|\\/)?(\\s|\\/)?'+cleanedTag+'>)');
                }
            }
            var strAllowed = aNewAllowed.join('|');
            var reAllowed = new RegExp(strAllowed, "i");

            var aFoundTags = string.match(new RegExp("<[^>]*>", "g"));

            for(var j=0; j < aFoundTags.length; j++) {
                if(!aFoundTags[j].match(reAllowed)) {
                    string = string.replace((new RegExp(aFoundTags[j], "gm")), '');
                }
            }
            return string;
        } else {
            return string.replace(/\<[^\>]+\>/g, '');
        }
    },


    /**
     * @function {String} ?
     * Convert listed characters to HTML entities
     * @param {String} string
     * @return string encoded
     */
    htmlEntitiesEncode: function(string)
    {
        if (string && string.replace) {
            var re = false;
            for (var i = 0; i < this._chars.length; i++) {
                re = new RegExp(this._chars[i], "gm");
                string = string.replace(re, '&' + this._entities[i] + ';');
            }
        }
        return string;
    },


    /**
     * @function {String} ?
     * Convert listed HTML entities to character
     * @param {String} string
     * @return string decoded
     */
    htmlEntitiesDecode: function(string)
    {
        if (string && string.replace) {
            var re = false;
            for (var i = 0; i < this._entities.length; i++) {
                re = new RegExp("&"+this._entities[i]+";", "gm");
                string = string.replace(re, this._chars[i]);
            }
            string = string.replace(/&#[^;]+;?/g, function($0){
                if ($0.charAt(2) == 'x') {
                    return String.fromCharCode(parseInt($0.substring(3), 16));
                }
                else {
                    return String.fromCharCode(parseInt($0.substring(2), 10));
                }
            });
        }
        return string;
    },

    /**
     * @function ?
     * Encode a string to UTF8
     * @param {String} string
     * @return {String} string utf8 encoded
     */
    utf8Encode: function(string)
    {
        string = string.replace(/\r\n/g,"\n");
        var utfstring = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utfstring += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utfstring += String.fromCharCode((c >> 6) | 192);
                utfstring += String.fromCharCode((c & 63) | 128);
            }
            else {
                utfstring += String.fromCharCode((c >> 12) | 224);
                utfstring += String.fromCharCode(((c >> 6) & 63) | 128);
                utfstring += String.fromCharCode((c & 63) | 128);
            }

        }
        return utfstring;
    },

    /**
     * @function {String} ?
     * Make a string shorter without cutting words
     * @param {String} str
     * @param {Number} n - number of chars of the short string
     * @return string shorted
     */
    shortString: function(str,n) {
      var words = str.split(' ');
      var resultstr = '';
      for(var i = 0; i < words.length; i++ ){
        if((resultstr + words[i] + ' ').length>=n){
          resultstr += '&hellip;';
          break;
          }
        resultstr += words[i] + ' ';
        }
      return resultstr;
    },

    /**
     * @function {String} ?
     * Truncates a string, breaking words and adding ... at the end
     * @param {String} str
     * @param {Number} length - length limit for the string. String will be
     *        at most this big, ellipsis included.
     * @return short string
     */
    truncateString: function(str, length) {
        if(str.length - 1 > length) {
            return str.substr(0, length - 1) + "\u2026";
        } else {
            return str;
        }
    },

    /**
     * @function {String} ?
     * Decode a string from UTF8
     * @param {String} string
     * @return string utf8 decoded
     */
    utf8Decode: function(utfstring)
    {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while ( i < utfstring.length ) {

            c = utfstring.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utfstring.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utfstring.charCodeAt(i+1);
                c3 = utfstring.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }
        return string;
    },

    /**
     * @function {String} ?
     * Convert all accented chars to char without accent.
     * @param {String} string
     * @return string without accented chars
     */
    removeAccentedChars: function(string)
    {
        var newString = string;
        var re = false;
        for (var i = 0; i < this._accentedChars.length; i++) {
            re = new RegExp(this._accentedChars[i], "gm");
            newString = newString.replace(re, '' + this._accentedRemovedChars[i] + '');
        }
        return newString;
    },

    /**
     * @function {String} ?
     * Count the number of occurrences of a specific needle in a haystack
     * @param {String} haystack
     * @param {String} needle
     * @return int with number of occurrences
     */
    substrCount: function(haystack,needle)
    {
        return haystack ? haystack.split(needle).length - 1 : 0;
    },

    /**
     * @function {String} ?
     * eval a JSON string to a JS object
     * @param {String} JSON
     * @return object JS Object
     */
    evalJSON: function(strJSON, sanitize)
    {
        if((typeof(sanitize) == 'undefined' || sanitize == null) || this.isJSON(strJSON)) {
            try {
                if(typeof(JSON) !== "undefined" && typeof(JSON.parse) !== 'undefined'){
                    return JSON.parse(strJSON);
                }
                return eval('('+strJSON+')');
            } catch(e) {
                throw new Error('ERROR: Bad JSON string...');
            }
        }
    },

    isJSON: function(str)
    {
        str = str.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, '');
        return (/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(str);
    },

    /**
     * @function {String} ?
     *           escapes unsafe html chars to their entities
     * @param {String} string to escape
     * @return new escaped string
     */
    htmlEscapeUnsafe: function(str){
        var chars = this._htmlUnsafeChars;
        return str != null ? String(str).replace(/[<>&'"]/g,function(c){return chars[c];}) : str;
    },

    /**
     * @function {String} ? normalizes whitespace in string.
     *           string is trimmed and sequences of many
     *           whitespaces are collapsed.
     * @param {String} string to normalize
     * @return new normalized string
     */
    normalizeWhitespace: function(str){
        return str != null ? this.trim(String(str).replace(/\s+/g,' ')) : str;
    },

    toUnicode: function(str)
    {
        if(typeof(str) == 'string') {
            var unicodeString = '';
            var inInt = false;
            var theUnicode = false;
            var total = str.length;
            var i=0;

            while(i < total)
            {
                inInt = str.charCodeAt(i);
                if( (inInt >= 32 && inInt <= 126) ||
                        inInt == 8 ||
                        inInt == 9 ||
                        inInt == 10 ||
                        inInt == 12 ||
                        inInt == 13 ||
                        inInt == 32 ||
                        inInt == 34 ||
                        inInt == 47 ||
                        inInt == 58 ||
                        inInt == 92) {

                    /*
                    if(inInt == 34 || inInt == 92 || inInt == 47) {
                        theUnicode = '\\'+str.charAt(i);
                    } else {
                    }
                    */
                    if(inInt == 8) {
                        theUnicode = '\\b';
                    } else if(inInt == 9) {
                        theUnicode = '\\t';
                    } else if(inInt == 10) {
                        theUnicode = '\\n';
                    } else if(inInt == 12) {
                        theUnicode = '\\f';
                    } else if(inInt == 13) {
                        theUnicode = '\\r';
                    } else {
                        theUnicode = str.charAt(i);
                    }
                } else {
                    theUnicode = str.charCodeAt(i).toString(16)+''.toUpperCase();
                    while (theUnicode.length < 4) {
                        theUnicode = '0' + theUnicode;
                    }
                    theUnicode = '\\u' + theUnicode;
                }
                unicodeString += theUnicode;

                i++;
            }
            return unicodeString;
        }
    },

    /**
     * @function {String} ? escapes a unicode character. returns \xXX if hex smaller than 0x100, otherwise \uXXXX
     * @param {String} c char
     */
    escape: function(c) {
        var hex = (c).charCodeAt(0).toString(16).split('');
        if (hex.length < 3) {
            while (hex.length < 2) { hex.unshift('0'); }
            hex.unshift('x');
        }
        else {
            while (hex.length < 4) { hex.unshift('0'); }
            hex.unshift('u');
        }

        hex.unshift('\\');
        return hex.join('');
    },

    /**
     * @function {String} ? unescapes a unicode character escape sequence
     * @param {String} es escape sequence
     */
    unescape: function(es) {
        var idx = es.lastIndexOf('0');
        idx = idx === -1 ? 2 : Math.min(idx, 2);
        //console.log(idx);
        var hexNum = es.substring(idx);
        //console.log(hexNum);
        var num = parseInt(hexNum, 16);
        return String.fromCharCode(num);
    },

    /**
     * @function {String} ? escapes a string to unicode characters
     * @param {String} txt
     * @param {optional String[]} whiteList
     */
    escapeText: function(txt, whiteList) {
        if (whiteList === undefined) {
            whiteList = ['[', ']', '\'', ','];
        }
        var txt2 = [];
        var c, C;
        for (var i = 0, f = txt.length; i < f; ++i) {
            c = txt[i];
            C = c.charCodeAt(0);
            if (C < 32 || C > 126 && whiteList.indexOf(c) === -1) {
                c = this.escape(c);
            }
            txt2.push(c);
        }
        return txt2.join('');
    },

    escapedCharRegex: /(\\x[0-9a-fA-F]{2})|(\\u[0-9a-fA-F]{4})/g,

    /**
     * @function {String} ? unescapes a string
     * @param {String} txt
     */
    unescapeText: function(txt) {
        var m;
        while (m = this.escapedCharRegex.exec(txt)) {
            m = m[0];
            txt = txt.replace(m, this.unescape(m));
            this.escapedCharRegex.lastIndex = 0;
        }
        return txt;
    }
};

module.exports = new StringHelper();