'use strict';

var Config = require(basePath('/app/config/Repository'))

function LoadConfiguration() {
  // body...
}

LoadConfiguration.prototype.boot = function (app) {
  console.log('loading configs');

  var configRepository = new Config;

  app.instance('Config', configRepository);

  this.load(configRepository);
};

LoadConfiguration.prototype.load = function (configRepository) {
  var configs = getFiles(basePath('/config'));

  configs.forEach(function (configPath) {
    var relativePath = configPath.replace(basePath('/config/'), '');
    var pathList = relativePath.split('/');

    // If we don't have enough items or more then 2
    // [ 'app.js' ]             -> good
    // [ 'testing', 'app.js' ]  -> good
    // []                       -> bad
    // [ '1', '2', '3' ]        -> bad
    if ( ! pathList.length || pathList.length > 2) return;

    // pathList[0] -> is an environment title
    if (pathList.length == 2 && pathList[0] !== env('APP_ENV')) return;

    var configData = require(configPath)();

    configRepository.load(configData);
  });
};

module.exports = LoadConfiguration;
