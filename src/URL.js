import { URL as NodeURL } from 'url'
import normalizeUrl from 'normalize-url'

export default class URL {
  constructor (url) {
    if (typeof url === 'string') {
      this.href = url
    } else {
      Object.assign(this, url)
    }
    this.normalizedHref = normalizeUrl(this.href)
  }

  update (href) {
    this.href = href
    this.normalizedHref = normalizeUrl(this.href)
  }

  toString () {
    return this.normalizedHref
  }

  valueOf () {
    return this.normalizedHref
  }

  get isValid () {
    try {
      new NodeURL(this.href) // eslint-disable-line
      this._isValid = true
    } catch (e) {
      this._isValid = false
    }
    return this._isValid
  }
}
