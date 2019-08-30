const mqtt = require('mqtt')
const messageHandler = require('./message').messageHandler
const mqttConfig = require('../config/index').mqtt
const mqttURL = mqttConfig.url + ':' + mqttConfig.port + mqttConfig.path
const wsConnect = require('../data/connectPool').wsConnect
const getLEDs = require('../data/leds').getLEDs

function initMqttClient(mqttURL, options = null, wsConnect) {
  const client = mqtt.connect(mqttURL, options)
  client.on('connect', function() {
    subscribeHandler(client, wsConnect)
  })
  client.on('message', function(topic, message) {
    // message is Buffer
    // console.log(message.toString())
    messageHandler(topic, message)
  })
  client.on('close', function() {
    console.log('mqtt服务断开')
    client.end()
  })
  return client
}

function subscribeHandler(client, wsConnect) {
  const topics = getTopics(wsConnect)
  if (topics.length > 0) {
    topics.forEach(topic => {
      client.subscribe(topic, function(err) {
        if (!err) {
          client.publish(topic, 'init')
        }
      })
    })
  }
}

function getConnectStatus(wsConnect) {
  const LEDs = getLEDs()
  const connectStatus = {}
  Object.keys(wsConnect).forEach(item => {
    connectStatus[item] = {
      ...LEDs[item]
    }
  })
  return connectStatus
}

// Devs\Led\{group}\{id}
function getTopics(wsConnect) {
  const connectStatus = getConnectStatus(wsConnect)
  const topics = []
  Object.keys(connectStatus).forEach(item => {
    const topic = `Devs\\Led\\${connectStatus[item].group}\\${item}`
    topics.push(topic)
  })
  return topics
}

module.exports = {
  mqttClient: initMqttClient(mqttURL, null, wsConnect),
  subscribeHandler
}
