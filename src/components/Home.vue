<template>
  <div class="Home">
    <h1 class="Title">Kindle to Are.na</h1>

    <Notification />

    <div class="Spinner" v-if="isLoading"></div>
    <Navigation @about="onShowAbout" />

    <transition name="slow-fade">
      <div class="Books" v-if="showBooks">
        <Book v-for="book in books" :id="book.id" :data="book" @show="onShowClippings" v-if="books" />
      </div>
      <div class="Books__info" v-else>
        <div class="Books__infoInner">
          Drag & drop your Kindle's clippings in here
        </div>
      </div>
    </transition>

    <transition name="fade">
      <Clippings :data="clippings" :channels="channels" :book="selectedBook" @close="closeClippings" v-if="showClippings" />
    </transition>

    <transition name="fade">
      <About @close="closeAbout" v-if="showAbout" />
    </transition>

  </div>
</template>

<script>
import mixins from '../mixins'
import config from '../../config'

import About from './About.vue'
import Notification from './Notification.vue'
import Book from './Book.vue'
import Clippings from './Clippings.vue'
import Navigation from './Navigation.vue'

const VALID_EXTENSIONS = ['.txt']

export default {
  mixins: [mixins],
  components: {
    About,
    Book,
    Clippings,
    Navigation,
    Notification
  },
  data () {
    return {
      showBooksId: undefined,
      isLoading: false,
      showAbout: false,
      showClippings: false,
      user: undefined,
      books: undefined,
      showBooks: false,
      selectedBook: undefined,
      channels: [],
      clippings: [],
      dropArea: undefined
    }
  },
  watch: {
    showAbout (value) {
      value ? this.blockScroll() : this.unblockScroll()
    },
    showClippings (value) {
      value ? this.blockScroll() : this.unblockScroll()
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.loadBooksFromLocalStorage()
      this.setupDropArea()
      this.getStatus()
      this.bindEvents()
    })
  },
  methods: {
    bindEvents () {
      document.onkeydown = (e) => {
        e = e || window.event

        if (e.keyCode === 27) {
          this.showAbout = false
          window.bus.$emit(config.ACTIONS.CLOSE_ABOUT)
          window.bus.$emit(config.ACTIONS.CLOSE_CLIPPINGS)
        }
      }
    },
    unblockScroll () {
      document.body.classList.remove('block-scroll')
    },
    blockScroll () {
      document.body.classList.add('block-scroll')
    },
    saveBooksToLocalStorage () {
      this.saveItemToLocalStorage('books', this.books)
    },
    loadOpenBook () {
      let book = this.getItemFromLocalStorage('selected_book')

      if (book && book.title) {
        this.onShowClippings(book.title)
      }
    },
    loadBooksFromLocalStorage () {
      this.books = this.getItemFromLocalStorage('books')
      this.showBooks = this.books ? true : false
    },
    closeAbout () {
      this.showAbout = false
    },
    closeClippings () {
      if (this.selectedBook) {
        this.$delete(this.books[this.selectedBook.title], 'selected')
        this.selectedBook = undefined
      }
      this.clippings = []
      this.showClippings = false
    },
    killEvent(e) {
      e.preventDefault();
      e.stopPropagation();
    },
    onDragOver () {
      this.dropArea.classList.add('is-dragover');
      this.showBooks = false
    },
    onDragEnd () {
      this.dropArea.classList.remove('is-dragover');

      if (this.showBooksId) {
        clearTimeout(this.showBooksId)
      }

      this.showBooksId = setTimeout(() => {
        this.showBooks = this.books ? true : false
      }, 500)
    },
    setupDropArea () {
      this.dropArea = document.body

      'drag dragstart dragend dragover dragenter dragleave drop'.split(' ').forEach((e) => {
        this.dropArea.addEventListener(e, this.killEvent, false)
      })

      'dragover dragenter'.split(' ').forEach((e) => {
        this.dropArea.addEventListener(e, this.onDragOver.bind(this), false)
      })

      'dragleave dragend drop'.split(' ').forEach((e) => {
        this.dropArea.addEventListener(e, this.onDragEnd.bind(this), false)
      })

      this.dropArea.addEventListener('drop', this.handleDrop.bind(this), false)
    },

    handleDrop (e) {
      this.isLoading = true

      if (this.showBooksId) {
        clearTimeout(this.showBooksId)
      }

      window.bus.showMessage('Loading your higlights')

      let dt = e.dataTransfer
      let files = dt.files

      this.handleFiles(files)
    },

    handleFiles (files) {
      ([...files]).forEach(this.uploadFile)
    },

    isValidExtension (extension) {
      return VALID_EXTENSIONS.includes(extension)
    },

    uploadFile (file) {
      let url = '/api/upload'
      let formData = new FormData()

      let extension = this.getFilenameExtension(file.name)

      this.closeClippings()
      this.closeAbout()

      if (!this.isValidExtension(extension)) {
        this.isLoading = false

        let message = `Sorry, we don't support the <strong>${extension}</strong> extension`
        this.showBooks = this.books ? true : false
        console.log('error', message);

        window.bus.showMessage(message)
        return
      }

      let reader = new FileReader()

      reader.onload = (event) => {
        this.dropArea.classList.remove('is-dragover')
        this.getClippings(event.target.result)
      }

      reader.readAsDataURL(file)
    },

    getClippings (data) {
      this.post(config.ENDPOINTS.CLIPPINGS, { data })
        .then(this.onGetClippings.bind(this))
        .catch((error) => {
          console.error(error)
        })
    },

    onGetClippings (response) {
      response.json().then((result) => {
        this.books = []
        this.showBooks = false

        window.bus.showMessage('Highlights loaded!')

        setTimeout(() => {
          this.books = result
          this.saveBooksToLocalStorage()
          this.showBooks = true
          this.isLoading = false
        }, 500)

      }).catch((error) => {
        console.error(error)
        window.bus.showMessage(`There was a problem loading your highlights: ${error}`)
        this.isLoading = false
      })
    },
    onGetChannels (response) {
      response.json().then((channels) => {
        this.channels = channels
      }).catch((error) => {
        console.error(error)
      })
    },
    onGetStatus (response) {
      response.json().then((result) => {
        if (!result && !result.user) {
          return
        }

        window.bus.user = result.user
        this.user = result.user

        if (this.user) {
          window.bus.$emit(config.ACTIONS.USER, this.user)
          this.loadOpenBook()
          this.getChannels()
        }
      }).catch((error) => {
        console.error(error)
      })
    },
    getChannels () {
      this.get(config.ENDPOINTS.CHANNELS)
        .then(this.onGetChannels.bind(this))
        .catch((error) => {
          console.error(error)
        })
    },
    getStatus () {
      this.get(config.ENDPOINTS.STATUS)
        .then(this.onGetStatus.bind(this))
        .catch((error) => {
          console.error(error)
        })
    },
    onShowClippings (title) {
      this.selectedBook = this.books[title] || undefined

      if (this.selectedBook) {
        this.clippings = this.books[title].clippings
        this.showClippings = true
      }
    },
    onShowAbout () {
      this.showAbout = true
    }
  }
}
</script>
