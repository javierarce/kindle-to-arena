<template>
  <button class="Book" @click="onClick">
    <div class="Book__inner">
      <div class="Book__content">
        <div class="Book__title" v-html="title"></div>
        <div class="Book__source" v-html="source"></div>
        <div class="Book__count" v-html="count"></div>
      </div>
      <div class="Pages Book__pages">
        <div class="Pages__page Book__page"></div>
        <div class="Pages__page Book__page"></div>
        <div class="Pages__page Book__page"></div>
        <div class="Pages__page Book__page"></div>
        <div class="Pages__page Book__page"></div>
        <div class="Pages__page Book__page"></div>
      </div>
    </div>
      <div class="Book__shadow"></div>
  </button>
</template>

<script>
import mixins from '../mixins'
import config from '../../config'

export default {
  props: ['data'],
  mixins: [mixins],
  watch: {
    data (value) {
      this.$el.classList[value.selected ? 'add' : 'remove']('is-selected')
    }
  },
  computed: {
    count () {
      let c = this.data.clippings.length
      return `${c} highlight${c !== 1 ? 's' : ''}`
    }
  },
  data () {
    return {
      title: undefined,
      source: undefined
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.title = this.data.title
      this.source = this.data.source
    })
  },
  methods: {
    onClick () {
      this.$set(this.data, 'selected', true)
      this.$emit('show', this.data.title)
    }
  }
}
</script>
