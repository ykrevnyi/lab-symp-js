'use strict';

var fs = require('fs');
var _ = require('lodash');
var path = require('path');

global.basePath = function (path) {
  return __dirname + path;
};

global.env = function (key, defaultValue) {
  return _.get(process.env, key, defaultValue);
};

global.route = function (route) {
  var app = require(basePath('/app/foundation/Application'));

  return app.make('Router').route(route);
};

global.exception = function (exceptionName) {
  var app = require(basePath('/app/foundation/Application'));
  var exceptionInstance = require(basePath('/app/exceptions/' + exceptionName));

  throw new exceptionInstance;
};

/**
 * Inherits classA from classB
 *
 * @param  {Function} target Target classA
 * @param  {Function} parent Sorce classB
 * @return {void}
 */
global.inherit = function (target, parent) {
  target.prototype = Object.create(parent.prototype, {
    constructor: {
      value: target,
      writable: false,
      enumerable: false,
      configurable: false
    }
  });
};


global.getFiles = function (dir, files_) {
  files_ = files_ || [];
  var files = fs.readdirSync(dir);
  for (var i in files) {
    var name = dir + '/' + files[i];
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files_);
    } else if (name.match(/\.js(?:on)?$/i)) {
      // for OS compatibility. On windows all '/' and '\' will convert to '\'.
      name = path.normalize(name);
      files_.push(name);
    }
  }
  return files_;
}
