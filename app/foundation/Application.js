'use strict';

var Router = require(basePath('app/router/index'));
var Container = require(basePath('app/foundation/Container'));
var ProviderRepository = require(basePath('app/foundation/ProviderRepository'));
var EnvironmentDetector = require(basePath('app/foundation/EnvironmentDetector'));

function Application() {
  Container.apply(this, arguments);

  this.isBootstrapped = false;
  this.environmentFile = '.env';
  this.environmentPath = basePath('');
  this.serviseProviders = [];
  
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

Application.prototype.registerConfiguredProviders = function() {
  var repository = new ProviderRepository(this);

  repository.load(config('app.providers'));
};

Application.prototype.register = function(provider) {
  provider.register();

  this.markAsRegistered(provider);

  return provider;
};

Application.prototype.markAsRegistered = function(provider) {
  this.serviseProviders.push(provider);
};

Application.prototype.boot = function() {
  this.serviseProviders.forEach(function(provider) {
    this.bootProvider(provider);
  }.bind(this));
};

Application.prototype.bootProvider = function(provider) {
  console.log('TODO: ');
  console.log('TODO: ');
  console.log('TODO: implement provider.boot() with DI availability');
  console.log('TODO: ');
  console.log('TODO: ');
  // if (provider.boot !== undefined) {
    // return provider
  // };
};

module.exports = new Application;
