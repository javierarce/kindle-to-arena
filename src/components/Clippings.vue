<template>
  <div class="Clippings" :class="className">
    <transition name="slide-fade">
    <div class="Clippings__inner" v-if="showClippings">

      <div class="Clippings__header">
        <div class="Spine Clippings__headerData">
          <div class="Clippings__bookTitle" v-html="book.title"></div>
          <div class="Clippings__bookSource" v-html="book.source"></div>
        </div>

        <div class="Clippings__actions">
          <transition name="slow-fade">
          <Channels class="Clippings__action" :data="channels" @select="onSelectChannel" v-if="channels.length" />
          </transition>

          <transition name="fade">
          <button class="Button Clippings__action has-spinner" :class="sendButtonClass" @click="onClickSend" v-if="isLoggedIn">
            <span v-html="sendButtonText" ></span>
            <div class="Spinner is-small" v-if="isLoading"></div>
          </button>
          <a href="/auth/arena" class="Button Clippings__action" v-else>
            Log in
          
        <svg class="Icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150.38 88.986" v-if="!isLoggedIn"><path d="M148.93 62.356l-20.847-16.384c-1.276-1-1.276-2.642 0-3.645l20.848-16.38c1.28-1.002 1.815-2.695 1.19-3.76-.626-1.062-2.374-1.44-3.88-.84l-24.79 9.874c-1.507.606-2.927-.22-3.153-1.83L114.57 2.926C114.34 1.317 113.13 0 111.877 0c-1.247 0-2.456 1.317-2.68 2.925l-3.73 26.467c-.228 1.61-1.646 2.434-3.155 1.83l-24.38-9.71c-1.512-.602-3.975-.602-5.483 0l-24.384 9.71c-1.508.604-2.928-.22-3.154-1.83L41.186 2.925C40.956 1.317 39.748 0 38.5 0c-1.252 0-2.463 1.317-2.688 2.925l-3.73 26.467c-.226 1.61-1.645 2.434-3.153 1.83L4.14 21.35c-1.507-.603-3.252-.223-3.878.838-.625 1.066-.092 2.76 1.184 3.76l20.85 16.38c1.277 1.003 1.277 2.645 0 3.646L1.446 62.356C.166 63.358-.364 65.152.26 66.34c.627 1.19 2.372 1.668 3.877 1.064l24.567-9.866c1.51-.603 2.914.218 3.125 1.828l3.544 26.696c.214 1.607 1.618 2.923 3.12 2.923 1.5 0 2.905-1.315 3.12-2.923l3.55-26.696c.21-1.61 1.62-2.43 3.122-1.828l24.164 9.698c1.506.606 3.97.606 5.477 0l24.16-9.698c1.504-.603 2.91.218 3.125 1.828l3.55 26.696c.212 1.607 1.617 2.923 3.115 2.923 1.502 0 2.907-1.315 3.12-2.923l3.55-26.696c.216-1.61 1.62-2.43 3.124-1.828l24.57 9.866c1.5.604 3.25.125 3.876-1.063.627-1.186.094-2.98-1.185-3.982zM95.89 46.18L77.53 60.315c-1.285.99-3.393.99-4.674 0L54.49 46.18c-1.284-.99-1.294-2.62-.02-3.625l18.4-14.493c1.274-1.005 3.363-1.005 4.638 0l18.4 14.493c1.277 1.004 1.267 2.634-.02 3.626z"></path></svg>
          
          </a>
          </transition>

        </div>

        <div class="Pages">
          <div class="Pages__page"></div>
          <div class="Pages__page"></div>
          <div class="Pages__page"></div>
          <div class="Pages__page"></div>
          <div class="Pages__page"></div>
          <div class="Pages__page"></div>
        </div>

      </div>

      <div class="Clippings__content">
        <div class="Clippings__contentHeader">
          <div class="Clippings__info" v-html="info" v-if="book.limited"></div>
          <div class="Clippings__contentHeaderActions">
            <button class="Link Clippings__action" @click="checkAll">Check all</button>
            <button class="Link Clippings__action" @click="checkNone">Uncheck all</button>
          </div>
        </div>

        <div class="Clippings__snippets">
          <Snippet 
            v-for="(clipping, index) in data" 
            :data="clipping" 
            @select="onSelectHighlight" 
            :index="index" 
            :v-id="index" />
        </div>
      </div>

      <div class="Pages Clippings__pages">
        <div class="Pages__page Clippings__page"></div>
        <div class="Pages__page Clippings__page"></div>
        <div class="Pages__page Clippings__page"></div>
        <div class="Pages__page Clippings__page"></div>
        <div class="Pages__page Clippings__page"></div>
        <div class="Pages__page Clippings__page"></div>
      </div>

    </div>
    </transition>
    <transition name="fade">
    <div class="Backdrop" @click="close" v-if="showBackdrop"></div>
    </transition>
  </div>
</template>

<script>
import mixins from '../mixins'
import config from '../../config'

import Snippet from './Snippet.vue'
import Channels from './Channels.vue'

export default {
  props: ['data', 'book', 'channels'],
  mixins: [mixins],
  components: {
    Channels,
    Snippet
  },
  data () {
    return {
      isLoggedIn: false,
      isLoading: false,
      selected: false,
      selectedChannel: undefined,
      selectedClippingsCount: 0,
      showBackdrop: false,
      showClippings: false,
      info: undefined
    }
  },
  computed: {
    className () {
      let i = Math.abs(+this.getHash(this.book.title)) % 12
      return `is-${i}`
    },
    sendButtonClass () {
      return this.canSend() ? 'is-selected' : 'is-disabled'
    },
    sendButtonText () {
      return `Send ${this.selectedClippingsCount} highlight${this.selectedClippingsCount !== 1 ? 's' : '' }`
    }
  },
  mounted () {
    this.bindEvents()
    this.isLoggedIn = window.bus.isLoggedIn()
    this.info = `We couldn't import <strong>${this.book.limited}</strong> highlights`

    this.$nextTick(() => {
      this.showBackdrop = true
      this.showClippings = true
    })
  },
  methods: {
    bindEvents () {
      window.bus.$off(config.ACTIONS.CLOSE_CLIPPINGS)
      window.bus.$on(config.ACTIONS.CLOSE_CLIPPINGS, this.close)
    },
    canSend () {
      return window.bus.isLoggedIn() && this.selectedChannel && this.selectedClippingsCount
    },
    onSelectHighlight () {
      this.countSelectedHighlights()
    },
    checkNone () {
      this.data.forEach((clipping, i) => {
        this.$delete(this.data[i], 'selected')
      })

      this.countSelectedHighlights()
    },
    checkAll () {
      this.data.forEach((clipping, i) => {
        this.$set(this.data[i], 'selected', true)
      })

      this.countSelectedHighlights()
    },
    countSelectedHighlights () {
      this.selectedClippingsCount = this.data.filter((s) => { return s.selected}).length
    },
    onClickSend (e) {
      if (!this.canSend()) {
        return
      }

      if (!this.selectedChannel) {
        let error = 'Please, select a channel first'

        console.error(error)
        window.bus.showMessage(error)
        return
      }

      this.isLoading = true

      let promises = []

      this.data.forEach((clipping) => {
        if (clipping.selected) {
          promises.push(this.sendClipping(clipping.body))
        }
      })

      Promise.all(promises).then((data) => {
        this.isLoading = false

        let channelTitle = this.selectedChannel.title
        let channelURL = `https://are.na/${window.bus.user.slug}/${this.selectedChannel.slug}`

        window.bus.showMessage(`<strong>${data.length} highlight${data.length !== 1 ? 's' : ''}</strong> successfully sent to <a target="_blank" href="${channelURL}">${channelTitle}</a>!`)
      })
    },
    close (e) {
      this.showClippings = false
      setTimeout(() => {
        this.showBackdrop = false
        this.$emit('close')
      }, 150)
    },
    sendClipping (content) {
      return new Promise((resolve, reject) => {
        let channel = this.selectedChannel.slug

        let title = this.book.title
        let description = `${this.book.title}, ${this.book.source}`

        this.post(config.ENDPOINTS.PUBLISH, { channel, title, description, content })
          .then((response) => {
            response.json().then((result) => {
              resolve(result)
            }).catch((error) => {
              console.error(error)
              window.bus.showMessage(`Sorry, there was an error contacting the server.`)
              reject(error)
            })
          })
          .catch((error) => {
            console.error(error)
            window.bus.showMessage(`Sorry, there was an error contacting the server.`)
            reject(error)
          })
      })
    },
    onSelectChannel (channel) {
      this.selectedChannel = channel
    }
  }
}
</script>
