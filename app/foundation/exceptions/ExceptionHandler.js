'use strict';

// TODO: implement Logger from published content
function ExceptionHandler () {
  this.logger = console;

  this.dontReport = [];
}

ExceptionHandler.prototype.report = function(error) {
  this.logger.error('logging error', error);
};

ExceptionHandler.prototype.render = function(error) {
  console.log('rendering exception view', error);
};

module.exports = ExceptionHandler;