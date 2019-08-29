const Koa = require('koa')
const app = new Koa()
const port = require('./config').server.port

app.use(async ctx => {
  ctx.body = 'Hello World'
})

app.listen(port)
