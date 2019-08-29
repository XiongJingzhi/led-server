const mqtt = require('mqtt')
const mqttConfig = require('../config/index').mqtt
const mqttURL = mqttConfig.path + ':' + mqttConfig.port + mqttConfig.url
const getLEDs = require('../utils/dataHandler').getLEDs

function initClient(mqttURL, opionts = null) {
  const client = mqtt.connect(mqttURL, options)
  client.on('connect', function() {
    client.subscribe(TOPIC, function(err) {
      if (!err) {
        client.publish(TOPIC, 'init')
      }
    })
  })
  
  client.on('message', function(topic, message) {
    // message is Buffer
    console.log(message.toString())
  })
  
  client.on('close', function() {
    console.log('mqtt服务断开')
    client.end()
  })
}

console.log(getLEDs())