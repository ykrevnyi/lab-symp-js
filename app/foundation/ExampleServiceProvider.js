'use strict';

var ServiceProvider = require(basePath('app/foundation/ServiceProvider'));

function ExampleServiceProvider() {
  ServiceProvider.apply(this, arguments);
}
inherit(ExampleServiceProvider, ServiceProvider);

ExampleServiceProvider.prototype.register = function() {
  console.log('registring myself');
};

module.exports = ExampleServiceProvider;
