<template>
  <div class="About">
    <transition name="slide-fade">
    <div class="About__content" v-if="showAbout">
      <div class="About__inner">

        <div class="About__innerContent">
          <div class="About__intro">
            <p>Send your Kindle's highlights and notes to <a target="_blank" href="https://are.na">Are.na</a></p>
          </div>

          <div class="About__questions">
            <div class="About__question">
              <strong class="About__title">How does this [fantastic] website work?</strong>
              <p>First, connect your Kindle to your computer and then find the file <span
                  class="code">My&nbsp;Clippings.txt</span> and drop it into this
                very website.</p><p>You'll see all your books and documents, and will
                be able to send highlights to any of your Are.na channels.</p>
              <p class="is-small"> 
                If you want to try before you buy, here's a <a target="_blank" href="/download">clippings</a> file just for you.
              </p>
            </div>

            <div class="About__question">
              <strong class="About__title">Do you store my clippings file somewhere?</strong>
              <p>Nope. Your file is sent to the server just to extract the
                highlights and notes, but the information is not stored.</p>
            </div>

            <div class="About__question">
              <strong class="About__title">Wait, but if I reload the page the highlights are there!</strong>
              <p>Yes, they are stored in the Local Storage of your browser.</p>
            </div>

            <div class="About__question">
              <strong class="About__title">Ok, let's say I want to edit a highlight before I send it</strong>
              <p>You can click on any text and change it. You can even use Markdown to format the highlight to your liking!</p>
            </div>

            <div class="About__question">
              <strong class="About__title">What's with 'We couldn't import X highlights' message?</strong>
              <p>I'm afraid that some original Kindle books have strict limits on how many highlights you can save :(</p>
            </div>
            </div>

          </div>

            <div class="About__more">
              <p>Hi! If you find a bug (or have a suggestion), please <a target="_blank" href="mailto://javier@hey.com">send me a message</a> or (better yet) create an issue <a href="https://github.com/javierarce/kindle-to-arena">in this GitHub repo</a>. Thanks!</p>
            </div>
        <div class="About__footer">
          <span>
            Made by Javier Arce / <a href="https://are.na/javier" target="_blank">Are.na</a> &middot; <a href="https://twitter.com/javier" target="_blank">Twitter</a>

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
