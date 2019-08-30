const Koa = require('koa')
const app = new Koa()
const initWs = require('./led').initWs
const port = require('./config').server.port
const getLEDs = require('./data/leds').getLEDs

app.use(async ctx => {
  ctx.body = getLEDs()
})

app.listen(port, function() {
  initWs()
  console.log('已开启led服务连接')
})
