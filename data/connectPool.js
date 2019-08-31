const getLEDs = require('./leds').getLEDs
// 连接池
// {
//   'y10-xxxxx': wsObject,
// }
const wsConnect = {}

// 请求池
// {
//   '1312-r1xr-fdsa-dfds': {
//     status: 'sent' || 'error' || 'success' || 'restart' || 'pause',
//     callback: function(){}
//   }
// }
const actions = {}

// led 数据持久层
// 0 为默认编组
// {
//   'y10-xxxxx': {
//     group: '0',
//     enable: false
//   }
// }

function getConnectStatus() {
  const LEDs = getLEDs()
  const connectStatus = {}
  Object.keys(wsConnect).forEach(item => {
    connectStatus[item] = {
      ...LEDs[item]
    }
  })
  return connectStatus
}

module.exports = {
  wsConnect,
  actions,
  getConnectStatus
}
