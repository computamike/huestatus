'use strict'

const BaseClass = require('./Class')

class Lamp extends BaseClass {
  constructor (config, light, lights) {
    super(config)
    this.light = light
    this.lights = lights
    this.name = light.name

    this._saveState()

    this.log(`  💡  ${this.name} is ${!this.light.reachable ? 'not ' : ''}reachable ${this.light.reachable ? '✅' : '⛔️'}`)
  }

  _saveState () {
    this.initialState = {
      hue: this.light.hue,
      brightness: this.light.brightness,
      saturation: this.light.saturation,
      alert: this.light.alert
    }
  }

  async setStatus (status) {
    // Check status to decide if we need to save or can't override

    const settings = status ? this.config.hue.statuses[status] : this.initialState

    await this.save(settings)
  }

  async save (settings) {
    this.light.hue = settings.hue
    this.light.saturation = settings.saturation
    this.light.brightness = settings.brightness
    this.light.alert = settings.flashing ? 'lselect' : 'none'

    await this.lights.save(this.light)

    this.isDirty = 1
  }

  async alert (message) {
    await this.setStatus('alert')
  }

  async warning (message) {
    await this.setStatus('warning')
  }

  async ok (message) {
    await this.setStatus('ok')
  }

  async working (message) {
    await this.setStatus('working')
  }

  async reset () {
    if (this.isDirty) {
      await this.setStatus()
    }
  }
}

module.exports = Lamp