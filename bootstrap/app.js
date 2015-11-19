'use strict';

var app = require(basePath('app/foundation/Application'));

app.alias(
  basePath('app/http/Kernel'), 
  'app/http/Kernel'
);

app.alias(
  basePath('app/foundation/exceptions/ExceptionHandler'),
  'app/foundation/exceptions/ExceptionHandler'
);

module.exports = app;
