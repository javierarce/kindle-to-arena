const TEXTS = {
  TEST: 'test'
}

const ACTIONS = {
  ABOUT: 'about',
  CLICK: 'click',
  CHANNELS: 'channels',
  CLOSE_ABOUT: 'close-about',
  CLOSE_CLIPPINGS: 'close-clippings',
  LOGIN: 'close-about',
  SHOW_MESSAGE: 'show-message',
  USER: 'user'
}

/* BE CAREFUL WHEN CHANGING THESE SETTINGS */

const ENDPOINTS = {
  PUBLISH: '/api/publish',
  CLIPPINGS: '/api/clippings',
  STATUS: '/api/status',
  CHANNELS: '/api/channels'
}

module.exports = { 
  ACTIONS,
  ENDPOINTS,
  TEXTS
}
