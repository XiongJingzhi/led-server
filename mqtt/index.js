const mqtt = require('mqtt')
const messageHandler = require('./message').messageHandler
const mqttConfig = require('../config/index').mqtt
const mqttURL = mqttConfig.url + ':' + mqttConfig.port + mqttConfig.path
const wsConnect = require('../data/connectPool').wsConnect
const getConnectStatus = require('../data/connectPool').getConnectStatus

function initMqttClient(mqttURL, wsConnect) {
  const mqttOption = {
    keepalive: 60,
    reconnectPeriod: 5 * 1000,
    connectTimeout: 30 * 1000,
    will: {
      topic: 'close',
      payload: 'led connection close'
    },
    resubscribe: true
  }
  const client = mqtt.connect(mqttURL, mqttOption)
  client.on('connect', function() {
    console.log('mqtt连接成功')
    subscribeHandler(client, wsConnect)
  })
  client.on('message', function(topic, message) {
    messageHandler(topic, message)
  })
  client.on('close', function() {
    console.log('mqtt连接已断开')
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
  mqttClient: initMqttClient(mqttURL, wsConnect),
  subscribeHandler
}
