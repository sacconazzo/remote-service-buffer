const fetch = require("node-fetch")

const service = function (path, name, time, headers) {
  this.path = path
  this.name = name
  this._time = time || 1000 * 60 * 5
  this._headers = headers || {}
  this._data = null
  this._time = 0
  this._loading = false

  this._setLoading = function (on) {
    this._loading = on ? new Date().getTime() : null
  }

  this._readyToLoad = function (cb) {
    const now = new Date()
    const diff = now.getTime() - this._time
    const timeout = now.getTime() - this._loading - now
    if (
      (!this._loading && diff > this.time) || //check buffer expired
      (this._loading && timeout > 1000 * 60) //check loading timeout
    )
      cb(now, diff, timeout)
  }

  this._getRemote = async function () {
    this._setLoading(true)
    let data = null
    try {
      const response = await fetch(this.path + this.name, {
        headers: this._headers,
      })
      data = await response.json()
    } catch (err) {}
    this._setLoading(false)
    if (data) {
      this._data = data
      this._time = new Date().getTime()
      return data
    }
  }

  this.get = async function () {
    if (this._data) {
      this._readyToLoad((now, diff) => {
        this._getRemote().then((ret) => console.log(`refresh after ${diff}ms: ${now.toString()}`)) //refresh buffer
      })

      return this._data //return buffer
    } else {
      return await this._getRemote() //if not yet been loaded
    }
  }

  this.get().then(() => console.log(`Buffer loaded for ${name}`)) //load buffer
}

exports = module.exports = service
