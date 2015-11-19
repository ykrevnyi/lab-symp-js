'use strict';

function Exception(message) {
  this.name = this.name || '<unnamed> Exception';
  this.message = message;
  this.stack = (new Error()).stack;
}
Exception.prototype = new Error;

Exception.prototype.is = function(name) {
  return this.name === name;
};

module.exports = Exception;
