'use strict';

// TODO: implement Logger from published content
function ExceptionHandler (Application) {
  this.app = Application;
  this.logger = console;

  this.dontReport = [];
}

ExceptionHandler.prototype.report = function(error) {
  this.logger.error('logging error', error);
};

ExceptionHandler.prototype.render = function(error) {
  console.log('rendering exception view', error);

  this.app.make('Response').status(error.code).end(error.message);
};

module.exports = ExceptionHandler;