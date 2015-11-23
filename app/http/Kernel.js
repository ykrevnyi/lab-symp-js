'use strict';

var express = require('express');

function Kernel (Application, Router) {
  this.app = Application;
  this.router = Router;

  this.bootstrappers = [
    basePath('app/foundation/bootstrap/DetectEnvironment'),
    basePath('app/foundation/bootstrap/LoadConfiguration'),
    basePath('app/foundation/bootstrap/ConfigureLogging'),
    basePath('app/foundation/bootstrap/HandleExceptions'),
    basePath('app/foundation/bootstrap/RegisterProviders'),
    basePath('app/foundation/bootstrap/BootProviders')
  ];
  this.middlewares = [
    basePath('app/http/middleware/CheckForMaintenanceMode')
  ];
  this.routeMiddlewares = [];

  this.routeMiddlewares.forEach(function(middleware, route) {
    router.use(route, this.app.make(middleware));
  });
}

Kernel.prototype.handle = function(req) {
  var response;

  try {
    response = this.sendRequestThroughRouter(req);
  } catch (error) {

    if (error.is === undefined) {
      console.log(error);
    }

    // Basic http error
    else if (error.is('HttpErrorException')) {
      response = 'HttpErrorException';
    } 

    // Server error
    else if (error.is('ServerErrorException')) {
      response = 'ServerErrorException';
    };
    
  }
  
  return response;
};

Kernel.prototype.sendRequestThroughRouter = function(req) {
  this.bootstrap();

  this.middlewares.forEach(function(middlewarePath) {
    var middleware = this.app.make(middlewarePath);

    this.router.middleware(middleware.handle.bind(this));
  }.bind(this));

  return 'sendRequestThroughRouter';
};

Kernel.prototype.dispatchToRouter = function() {
  return function dispatchToRouter (request) {
    this.app.instance('Request', request);

    console.log('dispatch to router');
    // return this.router.dispatch(request);
  }.bind(this);
};

Kernel.prototype.bootstrap = function() {
  if ( ! this.app.isBootstrapped) {
    this.app.bootstrapWith(this.bootstrappers);
  };
};

Kernel.prototype.terminate = function() {
  console.log('terminate application');
};

module.exports = Kernel;