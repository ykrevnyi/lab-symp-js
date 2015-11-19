'use strict';

var express = require('express');

function Router () {
  this.express = express();

  this.express.listen(3536);
}

Router.prototype.route = function(route) {
  return this.express.route(route);
};

module.exports = Router;