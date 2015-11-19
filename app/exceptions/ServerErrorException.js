'use strict';

var Exception = require(basePath('app/exceptions/Exception'));

function ServerErrorException(message) {
  this.name = 'ServerErrorException';

  Exception.apply(this, arguments);
}
inherit(ServerErrorException, Exception);

module.exports = ServerErrorException;
