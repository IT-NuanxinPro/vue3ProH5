<script setup>
import locale from 'element-plus/es/locale/lang/zh-cn'
const route = useRoute()
const router = useRouter()
const transName = ref('')

watch(
  () => router.currentRoute.value,
  (newValue, oldValue) => {
    if (newValue?.meta?.deepth && oldValue?.meta?.deepth) {
      if (oldValue.meta.deepth <= newValue.meta.deepth) {
        transName.value = 'push'
      } else {
        transName.value = 'back'
      }
    }
  },
  { immediate: true }
)
</script>

<template>
  <el-config-provider :locale="locale">
    <router-view v-slot="{ Component }">
      <transition :name="transName">
        <keep-alive>
          <component :is="Component" :key="route.path" v-if="route.meta.keepAlive" />
        </keep-alive>
      </transition>
      <transition :name="transName + 'normal'">
        <component :is="Component" :key="route.path" v-if="!route.meta.keepAlive" />
      </transition>
    </router-view>
  </el-config-provider>
</template>
