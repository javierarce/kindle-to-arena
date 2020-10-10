import config from '../config'

const METHODS = {
  DELETE: 'DELETE',
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT'
}

const HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}

export default {
  methods: {
    onError (e) {
      console.log('Error: ', e)
    },
    delete (url, body) {
      return window.fetch(url, {
        headers: HEADERS,
        method: METHODS.DELETE,
        body: JSON.stringify(body)
      })
    },
    put (url, body) {
      return window.fetch(url, {
        headers: HEADERS,
        method: METHODS.PUT,
        body: JSON.stringify(body)
      })
    },
    post (url, body) {
      return window.fetch(url, {
        headers: HEADERS,
        method: METHODS.POST,
        body: JSON.stringify(body)
      })
    },
    get (url) {
      return window.fetch(url, {
        headers: HEADERS,
        method: METHODS.GET
      })
    },
    truncate(str, n) {
      return (str.length > n) ? str.substr(0, n-1) + '&hellip;' : str
    },
    getFilenameExtension (filename) {
      let re = /(?:\.([^.]+))?$/
      return re.exec(filename)[0]
    },
    getHash (input) {
      let hash = 0, len = input.length
      for (let i = 0; i < len; i++) {
        hash  = ((hash << 5) - hash) + input.charCodeAt(i)
        hash |= 0; // to 32bit integer
      }
      return hash
    },
    saveItemToLocalStorage (key, content) {
      try {
        localStorage.setItem(key, JSON.stringify(content))
      } catch (e) {
        console.error(e)
      }
    },
    removeItemFromLocalStorage (key) {
      try {
        localStorage.removeItem(key)
      } catch (e) {
        console.error(e)
      }
    },
    getItemFromLocalStorage (key) {
      try {
        return JSON.parse(localStorage.getItem(key)) || undefined
      } catch (e) {
        console.error(e)
        return undefined
      }
    }
  }
}
