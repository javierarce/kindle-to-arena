<template>
  <div class="Snippet" :class="className" data-parent="true" @click="onSelect">
    <div class="Snippet__content" v-html="content" data-ignore="true" contenteditable ref="content"></div>
    <div class="Snippet__footer">
      <div class="Snippet__footerLeft">
        <div class="Snippet__action">Select</div>
        <transition name="fade">
        <button class="Snippet__revert Link" @click="onClickRevert" data-ignore="true" v-if="modified">Revert</button>
        </transition>
      </div>
      <div class="Snippet__footerRight">
        <div class="Snippet__datetime" v-html="date"></div>
      </div>
    </div>
  </div>
</template>

<script>
import mixins from '../mixins'
import config from '../../config'

const LIMIT_MESSAGE = 'You have reached the clipping limit for this item'

export default {
  props: ['data', 'index'],
  mixins: [mixins],
  data () {
    return {
      type: undefined,
      modified: false,
      content: undefined,
      selected: false,
      loggedIn: false,
      toggleSelectText: 'Check'
    }
  },
  computed: {
    className () {
      return `is-${this.type}`
    },
    date () {
      return this.data.metadata.time ? new Date(this.data.metadata.time).toDateString() : ''
    }
  },
  watch: {
    data (value) {
      this.selected = value.selected
    },
    selected (value) {
      this.toggleSelectText = value ? 'Uncheck' : 'Check'
      this.$el.classList[value ? 'add' : 'remove']('is-selected')
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.loggedIn = window.bus.isLoggedIn()
      this.content = this.data.limited ? LIMIT_MESSAGE: this.data.body
      this.type = this.data.metadata.type 

      this.$refs.content.addEventListener('keyup', () => {
        this.modified = this.$refs.content.innerText !== this.content
        this.updateSnippet()
      }, false)
    })
  },
  methods: {
    onSelect (e) {
      if (e && e.target.dataset && e.target.dataset.ignore) {
        return
      }

      this.selected = !this.selected
      this.$set(this.data, 'selected', this.selected)
      this.$emit('select')
    },
    onClickRevert () {
      this.modified = false
      this.$refs.content.innerText = this.content
      this.updateSnippet()
    },
    updateSnippet () {
      this.$set(this.data, 'body', this.$refs.content.innerText)
    },
    onClick () {
      this.$emit('send', this.index)
    }
  }
}
</script>
