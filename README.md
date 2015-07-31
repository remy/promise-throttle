# promise-throttle

Throttles promises to `n` concurrent promises at a time.

## Usage

```js
// run 10 promises at a time
var throttle = require('promise-throttle')(10);
var request = require('request');
var urls = [...];

var promises = urls.map(function (url) {
  return throttle(function (resolve, reject) {
    request(url, function (error, res, body) {
      if (error) {
        return reject(error);
      }

      if (res.statusCode === 200) {
        return resolve(body);
      } else {
        return reject(new Error(body)); // likely error too
      }
    });
  });
});

Promise.all(promises).then(function (requestData) {
  // requestData contains all the response data
  // limiting to 10 concurrent requests at a time.
});
```