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
            <strong class="About__title">How does this website work?</strong>
            <p>Connect your Kindle to your computer, find the file <span class="code">My Clippings.txt</span>, and drop it into this very website. You'll see all your books and documents and will be able to send highlights to any of your Are.na channels.</p>
          </div>

          <div class="About__question">
            <strong class="About__title">Do you store that clippings file somewhere?</strong>
            <p>Nope! The file is sent to the server to extract the highlights and notes, but they are not stored anywhere.</p>
          </div>

          <div class="About__question">
          <strong class="About__title">But if I reload the page the highlights are there!</strong>
          <p>Yes, they are stored in the Local Storage of your browser.</p>
          </div>

          <div class="About__question">
          <strong class="About__title">I found a typo/want to edit the highlight before sending it</strong>
          <p>No problem, you can click on any text and change it. You can even use Markdown to format the highlight to your liking.</p>
          </div>

          <div class="About__question">
          <strong class="About__title">What's with 'We couldn't import X highlights' message?</strong>
          <p>I'm afraid that some original Kindle books have strict limits on how many highlights you can save :(</p>
          </div>

          <div class="About__question">
          <strong class="About__title">I found a bug/have a suggestion</strong>
          <p>Sorry slash thanks! <a href="mailto://javier@hey.com">Send me a message</a> or better yet create an issue <a href="https://github.com/javierarce/kindle-to-arena">in this GitHub repo</a>.</p>
          </div>
        </div>

        <div class="About__footer">
          <span>
            Made by <a href="https://twitter.com/javier" target="_blank">Javier Arce</a></a>
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
