'use strict'

const fs = require('fs')

const config = require('../config')
const axios = require('axios')
const Kindle = require('./kindle')

const CHANNELS_PER_PAGE = 50
const API_BASE = 'https://api.are.na/v3'

module.exports = class Brain {
  constructor (accessToken) {
    this.accessToken = accessToken
    this.user = undefined
  }

  authHeaders () {
    return { Authorization: `Bearer ${this.accessToken}` }
  }

  getMe (request, response) {
    return axios.get(`${API_BASE}/me`, { headers: this.authHeaders() }).then((response) => {
      this.user = response.data
      return this.user
    })
  }

  createBlock (channelID, { title, description, content }) {
    let body = {
      value: content,
      title,
      description,
      channel_ids: [channelID]
    }

    return axios.post(`${API_BASE}/blocks`, body, { headers: this.authHeaders() })
      .then(response => {
        return response.data
      }).catch((error) => {
        console.error(error)
        return []
      })
  }

  publishSnippet (request, response) {
    let channelID = request.body.channel
    let content = request.body.content
    let title = request.body.title
    let description = request.body.description

    let user = request.session.passport && request.session.passport.user

    if (!user)  {
      response.json([])
      return
    }

    this.createBlock(channelID, { title, description, content }).then((data) => {
      response.json({ success: 'ok' })
    }).catch((error) => {
      console.error(error)
      response.json([])
    })
  }

  getClippings (request, response) {

    let buffer = new Buffer.from(request.body.data.replace('data:text/plain;base64,', ''), 'base64');
    let kindle = new Kindle()
    let books = kindle.parseData(buffer.toString())

    let i = 0
    let limitedCount = 0

    let clippings = {}

    books.forEach((book) => {
      if (book.metadata.type !== 'highlight' && book.metadata.type !== 'note') {
        return
      }

      let match = book.title.match(/(.*?)\((.*)\)$/)
      let title
      let source = undefined

      if (!match) {
        title = book.title
      } else {
        title = match[1]
        source = match[2]
      }

      if (!clippings[title]) {
        clippings[title] = { id: i++, title, source, clippings: [] }
      }

      delete book.title
      clippings[title].clippings.push(book)
    })

    Object.keys(clippings).forEach((key) => {
      let book = clippings[key]
      let count = book.clippings.filter(clipping => clipping.limited).length
      clippings[key].limited = count
      clippings[key].clippings = book.clippings.filter(clipping => !clipping.limited)
    })

    response.json(clippings)
  }

  getStatus (request, response) {
    response.json({ user: request.user })
  }

  getUserChannels (user, page, data = []) {
    let url = `${API_BASE}/users/${user.id}/contents`
    let params = {
      params: { per: CHANNELS_PER_PAGE, page, type: 'Channel' },
      headers: this.authHeaders()
    }

    return axios.get(url, params)
      .then(response => {
        let channels = response.data.data
        data.push(...channels)

        if (response.data.meta.has_more_pages) {
          return this.getUserChannels(user, page + 1, data)
        } else {
          return data
        }
      }).catch((error) => {
        console.error(error)
        return []
      })
  }

  getChannels (request, response) {
    let user = request.session.passport && request.session.passport.user

    if (!user)  {
      response.json([])
      return
    }

    this.getUserChannels(user, 1).then((data) => {

      let channels = data.map((channel) => {
        return { slug: channel.slug, title: channel.title, visibility: channel.visibility }
      }).filter((channel) => {
        return channel.slug !== process.env.CLIPPINGS_CHANNEL_ID
      })

      response.json(channels)
    }).catch((error) => {
      console.error(error)
      response.json([])
    })
  }
}
