const fetch = require("node-fetch")

const service = function (path, name, refresh, headers, log) {
  this.path = path
  this.name = name
  this._refresh = refresh || 1000 * 60 * 5
  this._headers = headers || {}
  this._log = log
  this._data = null
  this._time = 0
  this._loading = false

  this._setLoading = function (on) {
    this._loading = on ? new Date().getTime() : null
  }

  this._readyToLoad = function (cb) {
    const now = new Date()
    const diff = now.getTime() - this._time
    const timeout = now.getTime() - this._loading
    if (this._log) console.log(`check ${this.name} diff: ${diff} // timeout: ${timeout} // loading: ${this._loading}`)
    if (
      (!this._loading && diff > this._refresh) || //check buffer expired
      (this._loading && timeout > 1000 * 60) //check loading timeout
    ) {
      if (this._log) console.log(`refreshing ${this.name}...`)
      cb(now, diff, timeout)
    }
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
        this._getRemote().then(() => {
          if (this._log) console.log(`Refresh ${this.name} after ${diff}ms: ${now.toString()}`)
        }) //refresh buffer
      })

      return this._data //return buffer
    } else {
      return await this._getRemote() //if not yet been loaded
    }
  }

  this.get().then(() => {
    if (this._log) console.log(`Linkd ${name}`)
  }) //load buffer
}

exports = module.exports = service
