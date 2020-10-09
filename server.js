require('dotenv').config()

const path = require('path')
const express = require('express')
const app = express()
const cmd = require('node-cmd')
const bodyParser = require('body-parser')
const session = require('express-session')
const helmet = require('helmet')

const B = require('./lib/brain')

let Brain = new B()

const passport = require('passport')
const OAuth2Strategy = require('passport-oauth2')

const multer = require('multer')
const multipart = multer()

const sassMiddleware = require('node-sass-middleware')

const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpackConfig = require('./webpack.config.js')

const config = require('./config')

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

app.use(sassMiddleware({
  src: path.join(__dirname, 'src/assets/scss'),
  dest: '/public',
  sourceMap: true,
  force: true,
  outputStyle: 'compressed'
}))

const devServerEnabled = true

if (devServerEnabled) {
  //reload=true:Enable auto reloading when changing JS files or content
  //timeout=1000:Time from disconnecting from server to reconnecting
  [webpackConfig.entry.app].unshift('webpack-hot-middleware/client?reload=true&timeout=1000')

  webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin())

  const compiler = webpack(webpackConfig)

  app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath
  }))

  app.use(webpackHotMiddleware(compiler))
}

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(helmet())
 
app.use(session({ 
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true
}))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

if (process.env.CLIENT_ID && process.env.CLIENT_SECRET) {
  passport.use(new OAuth2Strategy({
    authorizationURL: 'https://dev.are.na/oauth/authorize',
    tokenURL: 'https://dev.are.na/oauth/token',
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
  }, (accessToken, refreshToken, profile, done) => {

    Brain = new B(accessToken)

    Brain.getMe().then((user) => {
      return done(null, user)
    }).catch(function (error) {
      console.log(error)
    })
  }
  ))
}

app.get('/auth/arena', passport.authenticate('oauth2'))
app.get('/auth/arena/callback', passport.authenticate('oauth2', { successRedirect: '/', failureRedirect: '/error' }))

app.get('/download', (request, response) => {
  const file = `${__dirname}/public/My Clippings.txt`;
  response.download(file); 
})

app.get('/api/status', (request, response) => { Brain && Brain.getStatus(request, response)})
app.post('/api/clippings', (request, response) => { Brain.getClippings(request, response) })
app.post('/api/publish', (request, response) => { Brain.publishSnippet(request, response)})
app.get('/api/channels', (request, response) => { Brain.getChannels(request, response)})
app.get('/api/collaborate', (request, response) => { Brain.addCollaborator(request, response)})

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/public/index.html')
})

const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port)
})
