'use strict';

function RegisterProviders () {
  // body...
}

RegisterProviders.prototype.boot = function() {
  console.log('register providers');
};

module.exports = RegisterProviders;