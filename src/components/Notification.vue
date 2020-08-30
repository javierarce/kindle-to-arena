<template>
  <div class="Notification">
    <transition :name="transitionName">
      <div class="Notification__message" v-html="message" v-if="show" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave"></div>
    </transition>
  </div>
</template>

<script>
import mixins from '../mixins'
import config from '../../config'

const TIME_OUT = 7000
const TRANSITION_NAME = 'notification'

export default {
  props: ['data'],
  mixins: [mixins],
  data () {
    return {
      show: false,
      message: undefined,
      timeoutID: undefined,
      transitionName: TRANSITION_NAME
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.bindEvents()
    })
  },
  methods: {
    bindEvents () {
      window.bus.$off(config.ACTIONS.SHOW_MESSAGE)
      window.bus.$on(config.ACTIONS.SHOW_MESSAGE, this.showMessage)
    },
    onMouseEnter () {
      if (this.timeoutID) {
        clearTimeout(this.timeoutID)
      }
    },
    onMouseLeave () {
      this.hide()
    },
    hide () {
      this.timeoutID = setTimeout(() => {
        this.show = false
      }, TIME_OUT)
    },
    publishMessage (message) {
      this.message = message
      this.show = true

      if (this.timeoutID) {
        clearTimeout(this.timeoutID)
      }

      this.hide()
    },
    showMessage (message) {
      if (this.message && this.message !== message) {
        this.show = false
        setTimeout(() => {
          this.publishMessage(message)
        }, 250)
      } else {
        this.publishMessage(message)
      }
    }
  }
}
</script>
