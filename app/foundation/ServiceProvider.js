'use strict';

function ServiceProvider () {
  // body...
}

ServiceProvider.prototype.register = function() {
  throw new Error('You have to override ServiceProvider::register()')
};

module.exports = ServiceProvider;