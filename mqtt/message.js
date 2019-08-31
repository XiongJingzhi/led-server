const getConnectStatus = require('../data/connectPool').getConnectStatus
const updateLED = require('../data/leds').updateLED

function enableHandler(cardId, data, callback) {
  if (data.type === 'startServer') {
    updateLED(cardId, null, true)
  }
  const allConnect = getConnectStatus()
  if (allConnect[cardId]['enable']) {
    callback()
  }
}

function messageHandler(topic, message) {
  console.log('sendData',)
  const cardId = topic.split(/\\/).pop()
  if (message.toString() === 'init') {
    console.log(`${topic} 订阅成功`)
    return
  }
  try {
    const data = JSON.parse(message.toString())
    const sendData = require('../led/webSocket').sendData
    const actions = require('../data/connectPool').actions
    console.log('sendData, actions', sendData, actions)
    enableHandler(cardId, data, function() {
      sendData(cardId, data, actions, function(data) {
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
