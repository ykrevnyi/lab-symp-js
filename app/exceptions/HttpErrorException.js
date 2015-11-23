'use strict';

var Exception = require(basePath('app/exceptions/Exception'));

function HttpErrorException() {
  this.name = 'HttpErrorException';
  Exception.apply(this, arguments);
}
inherit(HttpErrorException, Exception);

module.exports = HttpErrorException;
