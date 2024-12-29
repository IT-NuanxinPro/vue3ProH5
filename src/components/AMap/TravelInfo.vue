<template>
  <transition name="slide">
    <div class="travel-info" v-if="show && travelInfo.driving">
      <div class="travel-cards">
        <div 
          v-for="(mode, key) in modes"
          :key="key"
          class="travel-card" 
          :class="{ active: currentMode === key && showRoute }"
          @click="handleModeChange(key)"
        >
          <div class="mode-icon">{{ mode.icon }}</div>
          <div class="info">
            <div class="distance">{{ travelInfo[key].distance }}</div>
            <div class="time">{{ travelInfo[key].time }}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
const props = defineProps({
  show: Boolean,
  showRoute: Boolean,
  currentMode: String,
  travelInfo: Object
})

const emit = defineEmits(['mode-change'])

const modes = {
  driving: { icon: '🚗' },
  riding: { icon: '🚲' },
  walking: { icon: '🚶' }
}

const handleModeChange = (mode) => {
  emit('mode-change', mode)
}
</script>

<style lang="scss" scoped>
.travel-info {
  position: fixed;
  bottom: 36%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 98;
  width: 90%;
  max-width: 500px;

  .travel-cards {
    display: flex;
    justify-content: space-between;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

    .travel-card {
      flex: 1;
      text-align: center;
      padding: 8px;
      cursor: pointer;
      border-radius: 8px;
      transition: background-color 0.3s;

      &:hover {
        background-color: rgba(25, 137, 250, 0.1);
      }

      .mode-icon {
        font-size: 20px;
        margin-bottom: 4px;
      }

      .info {
        .distance {
          font-size: 14px;
          color: #333;
          font-weight: 500;
          margin-bottom: 2px;
        }

        .time {
          font-size: 12px;
          color: #666;
        }
      }

      &:not(:last-child) {
        border-right: 1px solid #eee;
      }

      &.active {
        background-color: rgba(25, 137, 250, 0.1);
        .distance, .time {
          color: #1989fa;
        }
      }
    }
  }
}

// 动画
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease-in-out;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translate(100%, 0);
}

.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  transform: translateX(-50%);
}
</style> 