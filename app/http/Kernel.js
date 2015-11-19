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

  return 'sendRequestThroughRouter';
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