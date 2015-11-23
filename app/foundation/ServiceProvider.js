'use strict';

function ServiceProvider () {
  // body...
}

ServiceProvider.prototype.register = function() {
  throw new Error('You have to override ServiceProvider::register()')
};

ServiceProvider.prototype.boot = function() {
  // body...
  console.log('booting service provider');
};

module.exports = ServiceProvider;
