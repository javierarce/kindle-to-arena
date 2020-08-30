<template>
  <div class="Channels" :class="className">
    <div class="Channels__content">
      <div class="Button Channels__title" @click="toggleShowChannels">
        <span class="Channels__titleChannel" v-html="selectedChannel"></span>
        <button target="_blank" class="Button Channels__visit" @click="onChannelClick" v-if="selectedChannelURL">→</button>
      </div>
      <div class="Channels__list">
        <div class="Channels__listInner" v-if="showChannels">
          <button class="Channel" :class="channelClass(index)" v-for="(channel, index) in data" v-html="channel.title" :data-index="index" @click="onClickChannel"></button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import mixins from '../mixins'
import config from '../../config'

export default {
  props: ['data'],
  mixins: [mixins],
  components: {
  },
  data () {
    return {
      selectedChannel: 'Select a channel',
      selectedChannelID: undefined,
      selectedChannelURL: undefined,
      showChannels: false
    }
  },
  watch: {
    showChannels (value) {
      value ? this.$el.classList.add('is-open') : this.$el.classList.remove('is-open')
    }
  },
  computed: {
    className () {
      return this.selectedChannelURL ? 'is-selected' : undefined
    }
  },
  methods: {
    onChannelClick (e) {
      e.preventDefault()
      e.stopPropagation()
      window.open(this.selectedChannelURL, '_blank')
    },
    onClickChannel (e) {
      this.selectedChannelID = +e.target.dataset.index
      let channel = this.data[this.selectedChannelID]
      this.selectedChannel = this.truncate(channel.title, 20)
      this.selectedChannelURL = `https://are.na/${window.bus.user.slug}/${channel.slug}`

      this.showChannels = false 
      this.$emit('select', channel)
      this.close()
    },
    close () {
      document.getElementById('main').removeEventListener('click', this.toggleShowChannels, false);
    },
    channelClass (index) {
      let classes = []

      classes.push(`is-${this.data[index].status}` )

      if (this.selectedChannelID === index) {
        classes.push('is-selected' )
      } 

      return classes.join(' ')
    },
    toggleShowChannels () {
      this.showChannels = !this.showChannels

      if (this.showChannels) {
        setTimeout(() => {
          document.getElementById('main').addEventListener('click', this.toggleShowChannels, false);
        }, 250);
      } else {
        this.close()
      }
    }
  }
}
</script>
