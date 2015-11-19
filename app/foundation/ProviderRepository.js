'use strict';

function ProviderRepository (app) {
  this.app = app;
}

ProviderRepository.prototype.load = function(providers) {
  console.log('loading providers', providers);

  providers.forEach(function(provider) {
    this.app.register(this.createProvider(provider));
  }.bind(this));
};

ProviderRepository.prototype.createProvider = function(provider) {
  var providerInstance = require(basePath(provider));

  return new providerInstance(this.app);
};

module.exports = ProviderRepository;