var fs = require('fs'), Mustache = require('mustache'), config = require('../config/config.js').config;

var View = function() {
	this.environment = {};
};
View.prototype = {
	environment : {},

	assign : function(name, data) {
		this.environment[name] = data;
	},

	renderView : function(name, data, callback) {
		var self = this;
	    if (typeof callback !== 'function') throw ViewCallbackException;
	 
	    self.getView(name, 'html', function(content) {
	      var template = Mustache.to_html(content, data);
	 
	      self.getLayout({}, function(content) {
	        content = self.setLayoutContent(content, template);
	        callback(content);
	      });
	    });
	},

    getView : function(name, format, callback) {
	    var self = this;
	 
	    if (!name) {
	      return '';
	    }
	 
	    var format = format ? format : 'html';
	    var path = config.web.templates + '/views/' + name + '.' + format;
	 
	    // callback handling
	    var callback = (typeof callback === 'function') ? callback : function() {};
	 
	    fs.readFile(path, 'utf-8', function(error, content) {
	    	if (error) {
	    		throw ViewNotFoundException;
	    	} else {
	    		callback(content);
	    	}
	    });
	},

	getLayout : function(options, callback) {
	    var self = this;
	    var options = options ? options : {
	      'name' : 'default',
	      'format' : 'html'
	    };
	    var name   = options.name ? options.name : 'default';
	    var format = options.format ? options.format : 'html';
	 
	    // callback handling
	    var callback = (typeof callback === 'function') ? callback : function() {
	    };
	 
	    var path = config.web.templates + '/layouts/' + name + '.' + format;
	 
	    fs.readFile(path, 'utf-8', function(error, content) {
	      if (error) {
	        throw LayoutNotFoundException;
	      } else {
	        callback(content);
	      }
	    });
	},

	setLayoutContent : function(layout, content) {
		var self = this;
		var layout = layout ? layout : '';
		self.assign('content_for_layout', content ? content : '');
		return Mustache.to_html(layout, self.environment);
	},

};
module.exports = View;