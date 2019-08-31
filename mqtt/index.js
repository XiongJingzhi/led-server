const mqtt = require('mqtt')
const messageHandler = require('./message').messageHandler


function initMqttClient(mqttURL, ws, option) {
  const mqttOption = option || {
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
    subscribeHandler(client, ws)
  })
  client.on('message', function(topic, message) {
    messageHandler(topic, message, ws)
  })
  client.on('close', function() {
    console.log('mqtt连接已断开')
  })
  return client
}

function subscribeHandler(client, ws) {
  const topics = getTopics(ws)
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
function getTopics(ws) {
  const connectStatus = ws.getConnectLEDs()
  const topics = []
  Object.keys(connectStatus).forEach(item => {
    const topic = `Devs\\Led\\${connectStatus[item].group}\\${item}`
    topics.push(topic)
  })
  return topics
}

module.exports = {
  initMqttClient,
  subscribeHandler
}
