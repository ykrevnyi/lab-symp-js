'use strict';

module.exports = function() {
  return {
    app: {
      'underMaintenance': false,
      'configFrom': 'config/app.js',
      'providers': [
        'app/foundation/ExampleServiceProvider'
      ]
    }
  };
};
