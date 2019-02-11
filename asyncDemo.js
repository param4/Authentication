const async = require('async')

async.auto({
  first: function(callback) {
    console.log('in first');
    callback(null, 'data', 'converted to array');
  },
  second: ['third', function(results, callback) {
    console.log('in second', JSON.stringify(results));
    callback(null, {
      'file': results.third,
      'email': 'user@example.com'
    });
  }],
  third: ['first', 'fourth', function(results, callback) {
    console.log('in third', JSON.stringify(results));
    callback(null, 'filename');
  }],
  fourth: function(callback) {
    console.log('in fourth');
    callback(null, 'folder');
  }
}, function(err, results) {
  console.log('results = ', results);
});