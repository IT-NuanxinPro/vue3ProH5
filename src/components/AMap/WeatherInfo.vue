<template>
  <div class="weather-info" v-if="weatherData">
    <div class="weather-content">
      <div class="current-weather">
        <span class="temperature">{{ weatherData.temperature }}°</span>
        <span class="weather">{{ weatherData.weather }}</span>
      </div>
      <div class="weather-detail">
        <span>湿度 {{ weatherData.humidity }}%</span>
        <span>{{ weatherData.windDirection }}风 {{ weatherData.windPower }}级</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  weatherData: Object
})
</script>

<style lang="scss" scoped>
.weather-info {
  position: fixed;
  top: 70px;
  right: 10px;
  background: rgba(255, 255, 255, 0.9);
  padding: 10px 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 99;

  .weather-content {
    .current-weather {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;

      .temperature {
        font-size: 24px;
        font-weight: 500;
        color: #323233;
      }

      .weather {
        font-size: 14px;
        color: #666;
      }
    }

    .weather-detail {
      display: flex;
      flex-direction: column;
      font-size: 12px;
      color: #666;
      gap: 2px;
    }
  }
}
</style> 