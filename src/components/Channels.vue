<template>
  <div class="Channels" :class="className">
    <div class="Channels__content">
      <div class="Button Channels__title" @click="toggleShowChannels">
        <transition name="fade">
        <div class="Spinner is-small" v-if="isLoading"></div>
        </transition>
        <span class="Channels__titleChannel" v-html="selectedChannel"></span>
        <button target="_blank" class="Button Channels__visit" @click="onChannelClick" v-if="selectedChannelURL">→</button>
      </div>
      <div class="Channels__list" v-if="!isLoading">
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

const TEXTS = {
  default: 'Select a channel',
  loading: 'Loading channels…'
}

export default {
  props: ['data'],
  mixins: [mixins],
  data () {
    return {
      isLoading: true,
      selectedChannel: TEXTS.loading,
      selectedChannelID: undefined,
      selectedChannelURL: undefined,
      showChannels: false
    }
  },
  watch: {
    data (value) {
      if (value && value.length) {
        this.enable()
      }
    },
    showChannels (value) {
      value ? this.$el.classList.add('is-open') : this.$el.classList.remove('is-open')
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.data && this.data.length) {
        this.enable()
      }
    })
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
    enable () {
      this.isLoading = false
      this.selectedChannel = TEXTS.default
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
