const initWs = require('./webSocket').initWs
const port = require('../config/index').led.port
const wsConnect = require('../data/connectPool').wsConnect
const actions = require('../data/connectPool').actions

module.exports = {
  initWs: () => { initWs(port, wsConnect, actions) }
}
