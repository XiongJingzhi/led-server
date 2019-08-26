// 连接池
// {
//   'y10-xxxxx': {
//     ws: wsObject,
//     group: '1',
//     enable: false
//   }
// }
let wsConnect = {}

// 请求池
// {
//   '1312-r1xr-fdsa-dfds': {
//     status: 'sent' || 'error' || 'success' || 'restart' || 'pause',
//     callback: function(){}
//   }
// }
let actions = {}

module.exports = {
  leds,
  actions
}