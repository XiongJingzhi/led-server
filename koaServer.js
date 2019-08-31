const Koa = require('koa')
const app = new Koa()
const LedWebSocket = require('./led').LedWebSocket
const ledPort = require('./config').led.port
const ledWebSocket = new LedWebSocket(ledPort)
const serverPort = require('./config').server.port

app.use(async ctx => {
  ctx.body = ledWebSocket.getConnectLEDs()
})

app.listen(serverPort, function() {
  ledWebSocket.initWs()
  console.log('已开启led服务连接')
})
