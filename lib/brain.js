'use strict'

const fs = require('fs')

const config = require('../config')
const axios = require('axios')
const Kindle = require('./kindle')

const Arena = require('are.na')

const CHANNELS_PER_PAGE = 50

module.exports = class Brain {
  constructor (accessToken) {
    this.accessToken = accessToken
    this.user = undefined
  }

  getMe (request, response) {
    this.arena = new Arena({ accessToken: this.accessToken })

    return new Promise((resolve, reject) => {
      axios.get(`https://api.are.na/v2/me?access_token=${this.accessToken}`).then((response) => {
        this.user = response.data
        resolve(this.user)
      })
    })
  }

  publishSnippet (request, response) {
    let content = request.body.content 
    let title = request.body.title 
    let description = request.body.description 

    this.arena.channel(request.body.channel)
      .createBlock({ title, description, content } )
      .catch((error) => {
        console.error(error)
        response.json({ error })
      })

    response.json({ success: 'ok' })
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
    let url = `https://api.are.na/v2/users/${user.id}/channels`
    let params =  { params: { access_token: this.accessToken, per: CHANNELS_PER_PAGE, page }}

    return axios.get(url, params) 
      .then(response => {
        let channels = response.data.channels

        if (page < response.data.total_pages) {
          data.push(...channels)

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
      response.json(data)
    }).catch((error) => {
      console.error(error)
      response.json([])
    })
  }
}
