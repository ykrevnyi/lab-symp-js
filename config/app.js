'use strict';

module.exports = function() {
  return {
    app: {
      'configFrom': 'config/app.js',
      'providers': [
        'app/foundation/ExampleServiceProvider'
      ]
    }
  };
};
