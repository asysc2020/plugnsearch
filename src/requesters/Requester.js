const request = require('request')

module.exports = class Requester {
  request (requestOptions) {
    return new Promise(function (resolve, reject) {
      request(requestOptions, (err, response) => {
        if (err) {
          reject(err)
        } else {
          resolve(response)
        }
      })
    })
  }
}
