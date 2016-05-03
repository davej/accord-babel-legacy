var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

var Adapter = require('accord/lib/adapter_base');
var path = require('path');
var W = require('when');
var sourcemaps = require('accord/lib/sourcemaps');

var Babel = (function(superClass) {
  extend(Babel, superClass);

  function Babel() {
    return Babel.__super__.constructor.apply(this, arguments);
  }

  Babel.prototype.name = 'babel';
  Babel.prototype.extensions = ['jsx', 'js'];
  Babel.prototype.output = 'js';
  Babel.prototype.isolated = true;

  Babel.prototype._render = function(str, options) {
    var filename;
    filename = options.filename;
    if (options.sourcemap === true) {
      options.sourceMap = true;
    }
    options.sourceMapName = filename;
    delete options.sourcemap;
    return compile((function(_this) {
      return function() {
        return _this.engine.transform(str, options);
      };
    })(this));
  };

  var compile = function(fn) {
    var data, err, error, res;
    try {
      res = fn();
    } catch (error) {
      err = error;
      return W.reject(err);
    }
    data = {
      result: res.code
    };
    if (res.map) {
      return sourcemaps.inline_sources(res.map).then(function(map) {
        data.sourcemap = map;
        return data;
      });
    } else {
      return W.resolve(data);
    }
  };

  return Babel;

})(Adapter);

module.exports = Babel;
