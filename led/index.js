const initWs = require('./webSocket').initWs
const port = require('../config/index').led.port
const wsConnect = require('../data/connectPool').wsConnect
const actions = require('../data/connectPool').actions
const LEDs = require('../data/leds').getLEDs()

initWs(port, wsConnect, actions)
