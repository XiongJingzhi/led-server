const config = require('../config')
const restartNotification = config.restartNotification
const http = require('http')

const restartReq = function(cardId) {
  if (!restartNotification.host) {
    return false
  }
  const options = {
    ...restartNotification,
    path: restartNotification.path + cardId
  }

  const req = http.request(options, function(res) {
    console.log('STATUS: ' + res.statusCode)
    console.log('HEADERS: ' + JSON.stringify(res.headers))
    res.setEncoding('utf8')
    res.on('data', function(chunk) {
      console.log('BODY: ' + chunk)
    })
  })

  req.on('error', function(e) {
    console.log('problem with request: ' + e.message)
  })

  req.end()
}

module.exports = restartReq