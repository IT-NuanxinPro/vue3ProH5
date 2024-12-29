<template>
  <div class="address-list">
    <template v-if="!loading">
      <template v-if="addressList.length">
        <div 
          v-for="item in addressList"
          :key="item.id"
          class="address-item"
          @click="handleSelect(item)"
        >
          <div class="title">{{ item.name }}</div>
          <div class="label">{{ item.address }}</div>
        </div>
      </template>
      <div v-else class="empty-status">
        <img src="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png" class="empty-image">
        <p class="empty-text">暂无地址数据</p>
      </div>
    </template>
  </div>
</template>

<script setup>
defineProps({
  loading: Boolean,
  addressList: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['select'])

const handleSelect = (item) => {
  emit('select', item)
}
</script>

<style lang="scss" scoped>
.address-list {
  height: calc(40vh - 54px);
  overflow-y: auto;
  background: #fff;

  .empty-status {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 60px;

    .empty-image {
      width: 60px;
      height: 60px;
    }

    .empty-text {
      margin-top: 15px;
      font-size: 14px;
      color: #969799;
    }
  }

  .address-item {
    padding: 16px;
    cursor: pointer;
    border-bottom: 1px solid #f5f5f5;
    transition: background-color 0.2s;

    &:active {
      background-color: #f5f5f5;
    }

    .title {
      font-size: 14px;
      color: #323233;
      margin-bottom: 4px;
    }

    .label {
      font-size: 12px;
      color: #969799;
    }
  }
}
</style> 