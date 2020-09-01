'use strict'

const fs = require('fs')

const HIGHLIGHT_REGEXP = /^- (?:Your )?(Highlight|Bookmark|Note) (?:at |on )?(page|location|loc.)s? (\d+)(-(\d+))?$/i

const TIME_REGEXP = /Added on (.*)$/i
const LIMIT_MESSAGE = '<You have reached the clipping limit for this item>'

module.exports = class Kindle {
  constructor () {
  }

  parseData (data) {
    return data.split(/==========\r\n/).map(l => l.trim()).filter(Boolean).map(this.parseClipping.bind(this)).reverse()
  }

  parseMetadata (line) {
    let parts = line.split('|').map(l => l.trim()).filter(Boolean)
    let part = parts.shift().toLowerCase()

    let metadata = {}

    let match = HIGHLIGHT_REGEXP.exec(part)
    metadata.type = match ? match[1] : undefined

    match = TIME_REGEXP.exec(parts)
    metadata.time = match ? match[1] : undefined

    return metadata
  }

  parseClipping (line) {
    let sections = line.trim().split('\r\n').map(l => l.trim()).filter(Boolean)

    let title = sections[0]
    let metadata = this.parseMetadata(sections[1])
    let body = sections[2]
    let limited = body === LIMIT_MESSAGE

    return { title, metadata, body, limited }
  }
}
