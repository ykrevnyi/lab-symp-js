'use strict';

function BootProviders () {
  // body...
}

BootProviders.prototype.boot = function() {
  console.log('booting providers');
};

module.exports = BootProviders;