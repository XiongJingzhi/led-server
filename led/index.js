const WebSocket = require('ws')
const addLED = require('../data/leds').addLED
const getLEDs = require('../data/leds').getLEDs
const initMqttClient = require('../mqtt').initMqttClient
const subscribeHandler = require('../mqtt').subscribeHandler
const restartReq = require('./restart')
const uuidv4 = require('uuid/v4')
const mqttConfig = require('../config/index').mqtt
const mqttURL = mqttConfig.url + ':' + mqttConfig.port + mqttConfig.path

class LedWebSocket {
  constructor(port, wsConnect, actions) {
    // 连接池
    // {
    //   'y10-xxxxx': wsObject,
    // }

    // 请求池
    // {
    //   '1312-r1xr-fdsa-dfds': {
    //     status: 'sent' || 'error' || 'success' || 'restart' || 'pause',
    //     callback: function(){}
    //   }
    // }
    // led 数据持久层
    // 0 为默认编组
    // {
    //   'y10-xxxxx': {
    //     group: '0',
    //     enable: false
    //   }
    // }
    this.port = port
    this.wsConnect = wsConnect || {}
    this.actions = actions || {}
    this.TIMEOUT = 20 * 1000
  }
  initWs() {
    const wsOption = {
      port: this.port,
      perMessageDeflate: {
        zlibDeflateOptions: {
          chunkSize: 1024,
          memLevel: 7,
          level: 3
        },
        zlibInflateOptions: {
          chunkSize: 10 * 1024
        },
        // Other options settable:
        clientNoContextTakeover: true,
        serverNoContextTakeover: true,
        serverMaxWindowBits: 10,
        // Below options specified as default values.
        concurrencyLimit: 10,
        threshold: 1024
      }
    }
    const wsConnect = this.wsConnect
    const actions = this.actions
    const wss = new WebSocket.Server(wsOption)
    const mqttClient = initMqttClient(mqttURL, this, null)
    const that = this
    function addWsConnect(ws, cardId, wsConnect) {
      const isExists = Object.keys(wsConnect).includes(cardId)
      if (!isExists) {
        wsConnect[cardId] = ws
        addLED(cardId)
        subscribeHandler(mqttClient, that)
        console.log(`LED ${cardId} 连接成功`)
      }
    }
    function messageHandler(ws, data, wsConnect, actions) {
      let cardId = ''
      for (const key in wsConnect) {
        if (wsConnect[key] === ws) {
          cardId = key
          break
        }
      }
      const action = actions[data._id]
      const type = data['_type']
      switch (type) {
        case 'restart':
          restartReq(cardId)
          break
        case 'error':
          action.status = 'error'
          action.callback(new Error(data['message']))
          break
        case 'pause':
          action.status = 'pause'
          action.callback(new Error(data['message']))
          break
        case 'success':
          action.status = 'success'
          action.callback(null, data)
          break
        default:
          action.status = 'other'
          action.callback(null, data)
      }
    }
    function removeWsConnect(ws, wsConnect) {
      for (const key in wsConnect) {
        if (wsConnect[key] === ws) {
          delete wsConnect[key]
          return
        }
      }
    }
    wss.on('connection', (ws, request) => {
      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message)
          console.log('ddad', data)
          if (data.cardId) {
            addWsConnect(ws, data.cardId, wsConnect)
          } else {
            messageHandler(ws, data, wsConnect, actions)
          }
        } catch (err) {
          console.log('LED连接失败')
          return
        }
      })

      ws.on('close', () => {
        removeWsConnect(ws, this.wsConnect)
        console.log('websocket close.')
      })

      ws.on('error', (err) => {
        removeWsConnect(ws, this.wsConnect)
        console.log('websocket 错误.', err)
      })
    })
    return wss
  }
  getConnectLEDs() {
    const LEDs = getLEDs()
    const connectStatus = {}
    Object.keys(this.wsConnect).forEach(item => {
      connectStatus[item] = {
        ...LEDs[item]
      }
    })
    return connectStatus
  }
  sendData(cardId, data, callback) {
    try {
      const jsonData = JSON.stringify(data)
      const actionId = uuidv4()
      const wsConnect = this.wsConnect
      const actions = this.actions
      const ws = wsConnect[cardId]
      if (!ws) {
        callback(new Error(cardId + '不存在'))
      } else {
        ws.send(jsonData, function() {
          actions[actionId] = { callback: callback, status: 'sent' }
        })
        setTimeout(function() {
          const action = actions[actionId]
          const status = action.status
          if (status === 'sent') {
            action.callback(new Error('LED安卓卡返回超时'))
          }
          delete actions[actionId]
        }, this.TIMEOUT)
      }
    } catch (err) {
      return callback(err)
    }
  }
}

module.exports = {
  LedWebSocket
}