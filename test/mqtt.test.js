const mqtt = require('mqtt')
const mqttConfig = require('../config/index').mqtt
const mqttURL = mqttConfig.url + ':' + mqttConfig.port + mqttConfig.path

const requestData = {
  '_id': '001', // 数据唯一ID
  'type': 'loadUrl',
  'url': 'http://www.m2mled.net/ex2015/index_en.html',
  'persistent': true  // 持久化，重启会自动加载url
}

const topic = 'Devs\\Led\\0\\y10-1111'
function initMqttClient(mqttURL) {
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
  })
  client.on('close', function() {
    console.log('mqtt连接已断开')
  })
  return client
}

const client = initMqttClient(mqttURL)

setTimeout(function() {
  client.publish(topic, Buffer.from(JSON.stringify(requestData)))
}, 3 * 1000)