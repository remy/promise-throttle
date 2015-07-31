module.exports = throttle;

function throttle(size) {
  if (!size) {
    throw new Error('requires a pool size');
  }
  var todo = [];
  var active = [];
  var guid = 0;

  function next() {
    if (todo.length) {
      var p = todo.shift();
      p.resolve(new Promise(p.handler));
    }
  }

  return function (promiseHandler) {
    guid++;
    var promise;
    var id = guid;
    if (active.length > size) {
      promise = new Promise(function (resolve) {
        todo.push({
          id: id,
          resolve: resolve,
          handler: promiseHandler,
        });
      });

      return promise;
    }

    var pop = function (res) {
      active.splice(active.indexOf(id), 1);
      next();
      return res;
    };

    var popThrow = function (error) {
      pop();
      throw error; // re-throw
    };

    promise = new Promise(promiseHandler).then(pop, popThrow);
    active.push(id);

    return promise;
  };
}