var test = require('tape');
var throttlePromise = require('../');
require('es6-promise').polyfill();

function factory(size) {
  var promises = [];
  for (var i = 0; i < size; i++) {
    promises.push(function (resolve) {
      var i = this;
      setTimeout(function () {
        resolve(i);
      }, 1000);
    }.bind(i)); // jshint ignore:line
  }

  return promises;
}

test('throttled promises', function (t) {
  var promises = factory(20);
  var throttle = throttlePromise(10);

  t.plan(1);
  Promise.all(promises.map(throttle)).then(function (res) {
    t.equal(res.length, 20, 'promises completed');
  });

});

test('still throws', function (t) {
  var promises = factory(10);
  promises.push(function () {
    throw new Error('failed');
  });
  promises = promises.concat(factory(9));
  var throttle = throttlePromise(10);

  t.plan(1);
  Promise.all(promises.map(throttle)).then(function (res) {
    t.equal(res.length, 20, 'promises completed');
  }).catch(function (error) {
    t.equal(error.message, 'failed', 'correctly threw error');
  });

});