<template>
  <div class="map-search">
    <!-- 搜索框 -->
    <div class="search-box">
      <van-search
        v-model="searchValue"
        placeholder="请输入地址"
        show-action
        @search="onSearch"
        @update:model-value="handleSearchInput"
      >
        <template #action>
          <span @click="onSearch">搜索</span>
        </template>
      </van-search>
    </div>

    <!-- 地图容器 -->
    <div id="container"></div>

    <!-- 距离提示框 -->
    <div class="distance-info" v-if="distanceInfo">
      <van-cell :title="distanceInfo" />
    </div>

    <!-- 地址列表 -->
    <div class="address-list">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell
          v-for="item in addressList"
          :key="item.id"
          :title="item.name"
          :label="item.address"
          @click="handleSelectAddress(item)"
        />
      </van-list>
    </div>

    <!-- 路线规划按钮，添加显示条件 -->
    <div 
      v-if="showRouteBtn"
      class="route-btn" 
      @click="toggleRoutePanel"
      @touchstart.passive="dragStart"
      @touchmove.passive="drag"
      @touchend.passive="dragEnd"
      :style="btnStyle"
    >
      <van-icon name="guide-o" size="24" />
    </div>

    <!-- 添加路线显示切换按钮 -->
    <div 
      v-if="showRouteBtn"
      class="route-toggle-btn" 
      @click="toggleRoute"
    >
      <van-icon :name="showRoute ? 'eye-o' : 'closed-eye'" size="24" />
    </div>

    <!-- 路线规划面板固定在上方 -->
    <transition name="slide">
      <div class="travel-info" v-if="showRoutePanel && travelInfo.driving">
        <div class="travel-cards">
          <div 
            class="travel-card" 
            :class="{ active: currentTravelMode === 'driving' && showRoute }"
            @click="switchTravelMode('driving')"
          >
            <div class="mode-icon">🚗</div>
            <div class="info">
              <div class="distance">{{ travelInfo.driving.distance }}</div>
              <div class="time">{{ travelInfo.driving.time }}</div>
            </div>
          </div>
          <div 
            class="travel-card"
            :class="{ active: currentTravelMode === 'riding' && showRoute }"
            @click="switchTravelMode('riding')"
          >
            <div class="mode-icon">🚲</div>
            <div class="info">
              <div class="distance">{{ travelInfo.riding.distance }}</div>
              <div class="time">{{ travelInfo.riding.time }}</div>
            </div>
          </div>
          <div 
            class="travel-card"
            :class="{ active: currentTravelMode === 'walking' && showRoute }"
            @click="switchTravelMode('walking')"
          >
            <div class="mode-icon">🚶</div>
            <div class="info">
              <div class="distance">{{ travelInfo.walking.distance }}</div>
              <div class="time">{{ travelInfo.walking.time }}</div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- 全局loading -->
    <van-overlay :show="isLoading" class="loading-overlay">
      <van-loading type="spinner" color="#1989fa" />
    </van-overlay>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import AMapLoader from '@amap/amap-jsapi-loader'
import { showToast, showLoadingToast, closeToast } from 'vant'

// 响应式数据
const searchValue = ref('')
const loading = ref(false)
const finished = ref(false)
const addressList = ref([])
const isLoading = ref(true)
const route = useRoute()
const currentPosition = ref(null)
const distanceInfo = ref('')
const travelInfo = ref({
  driving: {
    distance: '等待搜索...',
    time: '等待搜索...'
  },
  riding: {
    distance: '等待搜索...',
    time: '等待搜索...'
  },
  walking: {
    distance: '等待搜索...',
    time: '等待搜索...'
  }
})
const currentTravelMode = ref('')

// 添加路线面板显示状态
const showRoutePanel = ref(false)

// 添加按钮显示控制
const showRouteBtn = ref(false)

// 修改按钮位置相关变量
const btnStyle = ref({
  top: '120px',
  right: '15px'
})

// 拖动相关变量
const isDragging = ref(false)
const startY = ref(0)
const startX = ref(0)
const startTop = ref(0)
const startRight = ref(0)

// 开始拖动
const dragStart = (e) => {
  isDragging.value = true
  startY.value = e.touches[0].clientY
  startX.value = e.touches[0].clientX
  startTop.value = parseInt(btnStyle.value.top)
  startRight.value = parseInt(btnStyle.value.right)
}

// 拖动中
const drag = (e) => {
  if (!isDragging.value) return
  
  const deltaY = e.touches[0].clientY - startY.value
  const deltaX = e.touches[0].clientX - startX.value
  
  let newTop = startTop.value + deltaY
  let newRight = startRight.value - deltaX

  // 限制范围
  const maxTop = window.innerHeight - 50
  newTop = Math.max(60, Math.min(newTop, maxTop))
  newRight = Math.max(0, Math.min(newRight, window.innerWidth - 50))

  btnStyle.value = {
    top: `${newTop}px`,
    right: `${newRight}px`
  }

  // 如果需要阻止默认行为，使用 requestAnimationFrame 优化性能
  if (e.cancelable) {
    requestAnimationFrame(() => {
      e.preventDefault()
    })
  }
}

// 结束拖动
const dragEnd = () => {
  isDragging.value = false
}

// 添加一个新的状态来控制路线显示
const showRoute = ref(true)

// 修改切换路线面板的方法
const toggleRoutePanel = (e) => {
  if (isDragging.value) {
    e.stopPropagation()
    return
  }
  
  showRoutePanel.value = !showRoutePanel.value
}

// 修改切换出行方式的方法
const switchTravelMode = (mode) => {
  // 如果点击的是当前模式且路线已显示，则不做任何操作
  if (mode === currentTravelMode.value && showRoute.value) {
    return
  }
  
  // 先清除所有路线
  clearAllRoutes()
  currentTravelMode.value = mode
  showRoute.value = true
  // 显示新选择的路线
  showSelectedRoute(mode)
}

// 修改切换路线显示的方法
const toggleRoute = () => {
  showRoute.value = !showRoute.value
  if (showRoute.value) {
    showSelectedRoute(currentTravelMode.value)
  } else {
    clearAllRoutes()
  }
}

// 修改清除路线的方法
const clearAllRoutes = () => {
  window.driving && window.driving.clear()
  window.riding && window.riding.clear()
  window.walking && window.walking.clear()
}

// 修改显示选中路线的方法
const showSelectedRoute = (mode) => {
  clearAllRoutes()
  
  if (!showRoute.value) return

  const service = window[mode]
  if (service && currentPosition.value && window.marker) {
    const markerPosition = window.marker.getPosition()
    const startPoint = new AMap.LngLat(currentPosition.value[0], currentPosition.value[1])
    const endPoint = new AMap.LngLat(markerPosition.getLng(), markerPosition.getLat())

    service.search(
      startPoint,
      endPoint,
      (status, result) => {
        if (status === 'complete' && result.routes && result.routes[0]) {
          service.clear()
          service.search(
            startPoint,
            endPoint,
            {
              showMarker: false,
              waypoints: [],
              autoFitView: false
            }
          )
        } else {
          console.error(`${mode} 路线规划失败:`, status, result)
        }
      }
    )
  }
}

// 修改添加标记函数
const addMarker = (position) => {
  clearAllRoutes()
  
  if (window.marker) {
    window.marker.setMap(null)
  }
  
  const lngLat = new AMap.LngLat(position[0], position[1])
  window.marker = new AMap.Marker({
    position: lngLat,
    icon: new AMap.Icon({
      size: new AMap.Size(25, 34),
      imageSize: new AMap.Size(25, 34),
      image: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png'
    }),
    offset: new AMap.Pixel(-12, -34), // 设置偏移，使标记点底部中心对准位置
    zIndex: 2
  })
  window.marker.setMap(window.map)
  window.map.setCenter(lngLat)

  // 检查是否显示路线按钮
  if (currentPosition.value) {
    const isSamePosition = position[0] === currentPosition.value[0] && 
                          position[1] === currentPosition.value[1]
    showRouteBtn.value = !isSamePosition

    // 如果不是相同位置
    if (!isSamePosition) {
      // 计算所有路线信息（不显示路线）
      calculateAllRoutes(position)
      // 只显示当前选中的路线
      if (showRoute.value) {
        showSelectedRoute(currentTravelMode.value)
      }
    }
  }
}

// 格式化距离显示
const formatDistance = (distance) => {
  if (distance < 1000) {
    return `${Math.round(distance)}米`
  } else {
    return `${(distance / 1000).toFixed(1)}公里`
  }
}

// 格式化时间显示
const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.ceil((seconds % 3600) / 60)
  
  if (hours > 0) {
    return `约${hours}小时${minutes}分钟`
  }
  return `约${minutes}分钟`
}

// 搜索地址
const onSearch = () => {
  return new Promise((resolve, reject) => {
    if (!searchValue.value) {
      showToast('请输入搜索地址')
      reject(new Error('空地址'))
      return
    }

    window.placeSearch.search(searchValue.value, (status, result) => {
      if (status === 'complete' && result.poiList && result.poiList.pois && result.poiList.pois.length > 0) {
        addressList.value = result.poiList.pois.map((poi) => ({
          id: poi.id || Math.random().toString(36).substr(2, 9),
          name: poi.name || '未知地点',
          address: poi.address || '暂无地址',
          location: poi.location ? [poi.location.lng, poi.location.lat] : currentPosition.value
        }))
        if (addressList.value.length > 0) {
          showRoutePanel.value = true
          handleSelectAddress(addressList.value[0], true)
        }
        resolve()
      } else {
        showToast('未找到相关地址')
        reject(new Error('搜索失败'))
      }
    })
  })
}

// 修改输入框值变化时的处理
const handleSearchInput = (value) => {
  if (!value) {
    addressList.value = []
    // 只有当用户手动清空搜索框时才清除距离信息
    if (document.activeElement === document.querySelector('.van-search__field input')) {
      distanceInfo.value = ''
    }
  }
}

// 加载更多
const onLoad = () => {
  loading.value = false
  finished.value = true
}

// 修改计算所有路线信息的方法
const calculateAllRoutes = (position) => {
  if (!currentPosition.value) return

  const startPoint = new AMap.LngLat(currentPosition.value[0], currentPosition.value[1])
  const endPoint = new AMap.LngLat(position[0], position[1])

  // 计算驾车路线信息
  window.driving.search(
    startPoint,
    endPoint,
    (status, result) => {
      if (status === 'complete' && result.routes && result.routes[0]) {
        const route = result.routes[0]
        travelInfo.value.driving = {
          distance: formatDistance(route.distance),
          time: formatTime(route.time)
        }
      }
    }
  )

  // 计算骑行路线信息
  window.riding.search(
    startPoint,
    endPoint,
    (status, result) => {
      if (status === 'complete' && result.routes && result.routes[0]) {
        const route = result.routes[0]
        travelInfo.value.riding = {
          distance: formatDistance(route.distance),
          time: formatTime(route.time)
        }
      }
    }
  )

  // 计算步行路线信息
  window.walking.search(
    startPoint,
    endPoint,
    (status, result) => {
      if (status === 'complete' && result.routes && result.routes[0]) {
        const route = result.routes[0]
        travelInfo.value.walking = {
          distance: formatDistance(route.distance),
          time: formatTime(route.time)
        }
      }
    }
  )
}

// 初始化地图
const initMap = async () => {
  showLoadingToast({
    message: '加载中...',
    forbidClick: true,
    duration: 0
  })

  try {
    // 处理路由参数
    const { address } = route.query
    const defaultPosition = [117.26673, 39.069586] // 默认位置（先登里）
    let initialPosition = defaultPosition

    // 如果没有地址参数，先获取当前位置
    if (!address && navigator.geolocation) {
      try {
        const position = await getCurrentLocationPromise()
        initialPosition = [position.coords.longitude, position.coords.latitude]
      } catch (error) {
        console.error('获取位置失败：', error)
        showToast('定位失败，使用默认位置')
        initialPosition = defaultPosition
      }
    }
    // 设置当前位置（无论是定位得到的还是默认的）
    currentPosition.value = initialPosition

    // 初始化地图
    window._AMapSecurityConfig = {
      securityJsCode: 'd71d134ad30466716eba94c299f43ee8'
    }

    await AMapLoader.load({
      key: 'd61c96ab9e393a548ca4d1e14272ce64',
      version: '2.0',
      plugins: [
        'AMap.PlaceSearch',
        'AMap.Scale',
        'AMap.ToolBar',
        'AMap.GeometryUtil',
        'AMap.Driving',
        'AMap.Walking',
        'AMap.Riding'
      ]
    })

    window.map = new AMap.Map('container', {
      viewMode: '3D',
      zoom: 16,
      center: initialPosition
    })

    // 添加比例尺控件
    const scale = new AMap.Scale({
      position: 'LB' // 左下角
    })
    window.map.addControl(scale)

    // 添加缩放控件
    const zoomControl = new AMap.ToolBar({
      position: 'RB',           // 位置：RB表示右下，还可以是LT（左上）、RT（右上）、LB（左下）
      offset: new AMap.Pixel(10, 40),  // 偏移量，可以调整控件的具体位置
      showZoomBar: true,        // 显示缩放按钮
      showControlButton: false, // 不显示倾斜、旋转按钮
      theme: 'light'           // 主题，可选 'light' 或 'dark'
    })
    window.map.addControl(zoomControl)

    // 初始化搜索插件
    window.placeSearch = new AMap.PlaceSearch({
      city: '天津',
      pageSize: 10,
      pageIndex: 1
    })

    // 初始化所有出行方式
    window.driving = new AMap.Driving({
      policy: AMap.DrivingPolicy.LEAST_TIME,
      map: window.map
    })
    window.riding = new AMap.Riding({
      map: window.map
    })
    window.walking = new AMap.Walking({
      map: window.map
    })

    // 添加当前位置的蓝色标记
    addCurrentLocationMarker(currentPosition.value)

    // 如果有地址参数，进行搜索
    if (address) {
      searchValue.value = address
      showRoutePanel.value = true
      await onSearch()
    }

    closeToast()
    isLoading.value = false
  } catch (e) {
    console.error('地图初始化失败：', e)
    showToast('地图加载失败')
    isLoading.value = false
  }
}


const getCurrentLocationPromise = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    )
  })
}

// 修改添加当前位置的蓝色标记
const addCurrentLocationMarker = (position) => {
  if (window.currentLocationMarker) {
    window.currentLocationMarker.setMap(null)
  }
  
  const lngLat = new AMap.LngLat(position[0], position[1])
  window.currentLocationMarker = new AMap.Marker({
    position: lngLat,
    icon: new AMap.Icon({
      size: new AMap.Size(25, 34),
      imageSize: new AMap.Size(25, 34),
      image: '//webapi.amap.com/theme/v1.3/markers/b/mark_bs.png'
    }),
    offset: new AMap.Pixel(-12, -34), // 设置偏移，使标记点底部中心对准位置
    zIndex: 1
  })
  window.currentLocationMarker.setMap(window.map)
}

const handleSelectAddress = (item, isSearch = false) => {
  if (!isSearch) {
    searchValue.value = item.name
  }
  
  addMarker(item.location)
  window.map.setZoom(17)

  // 显示路线面板
  showRoutePanel.value = true
  // 重置选中的状态
  currentTravelMode.value = ''
}

onMounted(() => {
  initMap()
})

onUnmounted(() => {
  if (window.map) {
    window.map.destroy()
    // 清理全局变量
    window.map = null
    window.marker = null
    window.currentLocationMarker = null
    window.placeSearch = null
    window.driving = null
    window.riding = null
    window.walking = null
  }
})
</script>

<style lang="scss" scoped>
.map-search {
  height: 100vh;
  display: flex;
  flex-direction: column;

  .search-box {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
  }

  #container {
    flex: 1;
    width: 100%;
    height: 60vh;
    margin-top: 54px;
  }

  // 添加距离提示框样式
  .distance-info {
    position: fixed;
    top: 54px;
    left: 0;
    right: 0;
    z-index: 99;
    background: rgba(255, 255, 255, 0.9);
    padding: 8px 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    :deep(.van-cell) {
      padding: 5px 16px;
      text-align: center;
      
      &::after {
        display: none;
      }
    }
  }

  .address-list {
    height: calc(40vh - 54px);
    overflow-y: auto;
    background: #fff;
  }

  .loading-overlay {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .route-btn {
    position: fixed;
    width: 40px;
    height: 40px;
    background: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 99;
    cursor: pointer;
    touch-action: none; // 防止触摸事件被浏览器处理
    transition: transform 0.2s; // 添加过渡效果

    &:active {
      transform: scale(0.95);
      background: #f5f5f5;
    }
  }

  .travel-info {
    position: fixed;
    top: 64px;
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
      padding: 12px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    }

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

// 修改滑动动画
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}

.route-toggle-btn {
  position: fixed;
  right: 15px;
  bottom: 100px;
  width: 40px;
  height: 40px;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 99;
  cursor: pointer;

  &:active {
    background: #f5f5f5;
  }
}
</style>
