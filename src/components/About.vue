<template>
  <div class="About">
    <transition name="slide-fade">
    <div class="About__content" v-if="showAbout">
      <div class="About__inner">

        <div class="About__innerContent">
          <div class="About__intro">
            <p>Send your Kindle's highlights and notes to <a href="https://are.na">Are.na</a></p>
          </div>

          <div class="About__question">
            <strong class="About__title">How does it work?</strong>
            <p>Connect your Kindle to your computer, find the file <span class="code">My Clippings.txt</span>, and drop it into this website. You'll see all your books and documents and will be able to send your highlights to any of your Are.na channels.</p>
          </div>

          <div class="About__question">
            <strong class="About__title">Do you store that file somewhere?</strong>
            <p>Nope.</p>
          </div>

          <div class="About__question">
          <strong class="About__title">But if I reload the page the highlights are there!</strong>
          <p>They are stored in the Local Storage of your browser.</p>
          </div>

          <div class="About__question">
          <strong class="About__title">What's with 'We couldn't import X highlights' message?</strong>
          <p>I'm afraid that some original Kindle books have stricts limits on how many highlights you can save :(</p>
          </div>

          <div class="About__question">
          <strong class="About__title">I found a bug and/or have a suggestion</strong>
          <p><a href="mailto://javier@hey.com">Send me a message</a> or better yet create an issue <a href="https://github.com/javierarce/kindle-to-arena">in this repo</a> Thanks!</p>
          </div>
        </div>

        <div class="About__footer">
          <span>
            Made by <a href="https://twitter.com/javier">Javier Arce</a>
          </span>
        </div>
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
    </transition>


    <transition name="fade">
    <div class="Backdrop" @click="close" v-if="showBackdrop"></div>
    </transition>
  </div>
</template>
<script>

import mixins from '../mixins'
import config from '../../config'

export default {
  mixins: [mixins],
  data () {
    return {
      showAbout: false,
      showBackdrop: false
    }
  },
  mounted () {
    this.bindEvents()
    this.$nextTick(() => {
      this.showBackdrop = true
      this.showAbout = true
    })
  },
  methods: {
    bindEvents () {
      window.bus.$off(config.ACTIONS.CLOSE_ABOUT)
      window.bus.$on(config.ACTIONS.CLOSE_ABOUT, this.close)
    },
    close (e) {
      this.showAbout = false
      setTimeout(() => {
        this.showBackdrop = false
        this.$emit('close')
      }, 150)
    }
  }
}
</script>
