## led-server

### led ws 测试
chrome:
``` javascript
  const led1 = {"cardId":"y10-1111"}
  const led2 = {"cardId":"y10-2222"}
  function createWsClient(message) {
    const ws = new WebSocket('ws://127.0.0.1:8100')
     message = JSON.stringify(message)
    //添加事件监听
    ws.addEventListener('open', function () {
      ws.send(message)
    })
    return ws
  }
  const ws1 = createWsClient(led1)
  const ws2 = createWsClient(led2)
```

### mqtt 测试
mac:

- brew install mosquitto
- brew services start mosquitto
- node ./test/mqtt.test.js

window:

- install mosquitto
- mosquitto -v
- node ./test/mqtt.test.js