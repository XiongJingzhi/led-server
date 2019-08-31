const Koa = require('koa')
const app = new Koa()
const initWs = require('./led').initWs
const port = require('./config').server.port
const getConnectStatus = require('./data/connectPool').getConnectStatus

app.use(async ctx => {
  ctx.body = getConnectStatus()
})

app.listen(port, function() {
  initWs()
  console.log('已开启led服务连接')
})
