'use strict';

var Container = require(basePath('/app/foundation/Container'));
var Router = require(basePath('/app/router/index'));
var EnvironmentDetector = require(basePath('/app/foundation/EnvironmentDetector'));

function Application() {
  Container.apply(this, arguments);

  this.isBootstrapped = false;
  this.environmentFile = '.env';
  this.environmentPath = basePath('/');
  
  this.registerCoreBindings();
  this.registerCoreServices();
  this.registerCoreAliases();
}
inherit(Application, Container);

Application.prototype.registerCoreBindings = function() {
  this.instance('app', this);
  this.instance('Application', this);
  this.instance('app/foundation/Container', this);
};

Application.prototype.registerCoreServices = function() {
  this.singleton('Router', Router);
  // this.singleton('Events', new EventService(this));
};

Application.prototype.registerCoreAliases = function() {
  // body...
};

Application.prototype.bootstrapWith = function(bootstrappers) {
  this.isBootstrapped = true;

  bootstrappers.forEach(function(bootstrapper) {
    this.make(bootstrapper).boot(this);
  }.bind(this));
};

Application.prototype.detectEnvironment = function(cb) {
  var detector = new EnvironmentDetector(this.environmentPath, this.environmentFile);

  return this.env = detector.detect(cb);
};

module.exports = new Application;
