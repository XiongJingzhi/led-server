const updateLED = require('../data/leds').updateLED

function enableHandler(cardId, connectLEDs, data, callback) {
  if (data.type === 'startServer') {
    updateLED(cardId, null, true)
  }
  if (connectLEDs[cardId]['enable']) {
    callback()
  }
}

function messageHandler(topic, message, ws) {
  const cardId = topic.split(/\\/).pop()
  if (message.toString() === 'init') {
    console.log(`${topic} 订阅成功`)
    return
  }
  try {
    const data = JSON.parse(message.toString())
    const connectLEDs = ws.getConnectLEDs()
    enableHandler(cardId, connectLEDs, data, function() {
      ws.sendData(cardId, data, function(data) {
        console.log('data', data)
      })
    })
  } catch (error) {
    console.log('mqtt服务器数据JSON.parse错误', error)
  }
}

module.exports = {
  messageHandler
}
