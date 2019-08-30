const sendData = require('../led').sendData
const actions = require('../data/connectPool').actions
const getLEDs = require('../data/leds').getLEDs
const updateLED = require('../data/leds').updateLED

function enableHandler(cardId, data, callback) {
  if (data.type === 'startServer') {
    updateLED(cardId, null, true)
  }
  if (getLEDs[cardId]['enable']) {
    callback()
  }
}

function messageHandler(topic, message) {
  const cardId = topic.split(/\\/).pop()
  if (message.toString() === 'init') {
    return
  }
  try {
    const data = JSON.parse(message.toString())
    enableHandler(cardId, data, function() {
      sendData(cardId, data, actions, function(data) {
        console.log('data', data)
      })
    })
  } catch (error) {
    console.log('mqtt服务器数据格式错误')
  }
}

module.exports = {
  messageHandler
}
