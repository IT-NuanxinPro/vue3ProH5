<template>
  <div class="header">
    <div class="back" @click="back">
      <van-icon name="arrow-left" size="20px" />
    </div>
    <div class="title">{{ props.title }}</div>
    <div class="placeholder">
      <slot name="option"></slot>
    </div>
  </div>
</template>

<script setup>
// import useAppStore from '@/stores/modules/app'
// const route = useRoute()
const router = useRouter()
const props = defineProps({
  title: {
    require: true,
    type: String,
    default: ''
  }
})
function back() {
  router.go(-1)
}
</script>
<style lang="scss" scoped>
.header {
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: center;
  background-color: #bcd9f5;
  position: sticky;
  top: 0;
  z-index: 100;
  .back {
    width: 22vw;
    height: 100%;
    display: flex;
    // flex: 1;
    padding-left: 4vw;
    align-items: center;
    color: #33322d;
  }
  .title {
    width: 56vw;
    // flex: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 17px;
    color: #33322d;
  }
  .placeholder {
    width: 22vw;
    height: 100%;
  }
}
</style>
