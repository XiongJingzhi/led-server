## led-server

### led ws 测试
chrome:
0. const ws = new WebSocket('wx://127.0.0.1:8080')
1. ws.send(JSON.stringify({"cardId":"y10-2222"}))

### mqtt 测试
mac:
0. brew install mosquitto
1. brew services start mosquitto
2. mosquitto_pub -t 'Devs\Led\{group}\{id}' -m 'data'
3. mosquitto_sub -v -t 'Devs\Led\{group}\{id}'

window:
0. install mosquitto
1. mosquitto -v
2. mosquitto_pub -t 'Devs\Led\{group}\{id}' -m 'data'
3. mosquitto_sub -v -t 'Devs\Led\{group}\{id}'