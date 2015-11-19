'use strict';

function DetectEnvironment () {
  // body...
}

DetectEnvironment.prototype.boot = function(app) {
  app.detectEnvironment(function() {
    return env('APP_ENV', 'production');
  });
};

module.exports = DetectEnvironment;