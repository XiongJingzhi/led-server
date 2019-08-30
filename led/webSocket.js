const WebSocket = require('ws')
const addLED = require('../data/leds').addLED
const mqttClient = require('../mqtt').mqttClient
const subscribeHandler = require('../mqtt').subscribeHandler
const uuidv4 = require('uuid/v4')
const restartReq = require('./restart')
const TIMEOUT = 20 * 1000

// 请求数据
// {
//   "_id":"001", //数据唯一ID
//   "type":"loadUrl",
//   "url":"http://www.m2mled.net/ex2015/index_en.html",
//   "persistent": true  //持久化，重启会自动加载url
// }

// 返回数据
// {"cardId":"y10-xxxxx"}
// {"_id":"001","_type":"success"}
// {"_id":"001","_type":"error","message":"xxxxx"}
// {"_id":"001","_type":"restart","message":"xxxxx"}

function initWs(port, wsConnect, actions) {
  const wsOption = {
    port: port,
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
  const wss = new WebSocket.Server(wsOption)
  wss.on('connection', (ws, request) => {
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message)
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
      removeWsConnect(ws, wsConnect)
      console.log('websocket close.')
    })

    ws.on('error', (err) => {
      removeWsConnect(ws, wsConnect)
      console.log('websocket 错误.', err)
    })
  })
  return wss
}

function addWsConnect(ws, cardId, wsConnect) {
  const isExists = Object.keys(wsConnect).includes(cardId)
  if (!isExists) {
    wsConnect[cardId] = ws
    addLED(cardId)
    subscribeHandler(mqttClient, wsConnect)
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

function sendData(cardId, data, actions, callback) {
  try {
    const jsonData = JSON.stringify(data)
    const actionId = uuidv4()
    const ws = actions[cardId]
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
      }, TIMEOUT)
    }
  } catch (err) {
    return callback(err)
  }
}

module.exports = {
  initWs,
  sendData
}
