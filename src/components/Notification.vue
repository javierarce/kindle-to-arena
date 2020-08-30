<template>
  <div class="Notification">
    <transition :name="transitionName">
    <div class="Notification__message" v-html="message" v-if="show"></div>
    </transition>
  </div>
</template>

<script>
import mixins from '../mixins'
import config from '../../config'

const TIME_OUT = 5000
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
    publishMessage (message) {
      this.message = message
      this.show = true

      if (this.timeoutID) {
        clearTimeout(this.timeoutID)
      }

      this.timeoutID = setTimeout(() => {
        this.show = false
      }, TIME_OUT)
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
