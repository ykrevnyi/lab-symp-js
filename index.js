'use strict';

require('./helpers');

require(basePath('/bootstrap/autoload'));
var app = require(basePath('/bootstrap/app'));

var kernel = app.make('app/http/Kernel');

var response = kernel.handle(1);
kernel.terminate();

route('/new1').get(function(req, res) {
  res.send(response)
});

// setTimeout(function() {
//   throw new Error('try to handle me');
// }, 2000);

// console.log(kernel);
