'use strict';

var Exception = require(basePath('app/exceptions/Exception'));

function HttpErrorException(message) {
  this.name = 'HttpErrorException';
  Exception.apply(this, arguments);
}
inherit(HttpErrorException, Exception);

module.exports = HttpErrorException;
