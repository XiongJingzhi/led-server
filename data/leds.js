const fs = require('fs')
const path = require('path')
const ledPath = path.join(__dirname, '../data/persistence.json')

function getLEDs() {
  const led = fs.readFileSync(ledPath, { encoding: 'utf-8' })
  try {
    return JSON.parse(led) || {}
  } catch (error) {
    console.log(new Error('led数据存储问题' + error))
  }
}

function addLED(cardId) {
  const leds = getLEDs()
  const isExists = Object.keys(leds).includes(cardId)
  if (!isExists) {
    leds[cardId] = {
      group: '0',
      enable: false
    }
    fs.writeFileSync(ledPath, JSON.stringify(leds))
  }
}

function deleteLED(cardId) {
  const leds = getLEDs()
  delete leds[cardId]
  fs.writeFileSync(ledPath, JSON.stringify(leds))
}

function updateLED(cardId, group = null, enable = null) {
  const leds = getLEDs()
  if (leds[cardId]) {
    const old = leds[cardId]
    leds[cardId] = {
      group: group || old.group,
      enable: enable == null ? old.enable : enable
    }
    fs.writeFileSync(ledPath, JSON.stringify(leds))
  }
}

module.exports = {
  getLEDs,
  addLED,
  deleteLED,
  updateLED
}
