const initWs = require('./webSocket').initWs
const port = require('../config/index').led.port
const wsConnect = require('../data').wsConnect
const actions = require('../data').actions

initWs(port, wsConnect, actions)
