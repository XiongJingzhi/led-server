const webSocketLED = require('./led/webSocket')

function main() {
  // 1、建立ws服务, 等待led安卓卡连接, 存储led数据
  webSocketLED()
  // 2、建立HTTP服务，返回led分组数据
  koaServer()
  // 3、建立MQTT服务
  mqttServer()
}

main()