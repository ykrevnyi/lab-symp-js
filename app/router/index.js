'use strict';

var express = require('express');

function Router(Application) {
  this.express = express();

  Application.instance('Request', this.express.request);
  Application.instance('Response', this.express.response);

  var server = function(req, res) {
    this.handle(req, res, function(error) {
      Application.instance('Request', req);
      Application.instance('Response', res);
      
      return exception(error);
    });
  };

  this.express.listen.call(server.bind(this.express), 3536);
}

Router.prototype.route = function (route) {
  return this.express.route(route);
};

Router.prototype.middleware = function () {
  return this.express.use.apply(this.express, arguments);
};

module.exports = Router;
