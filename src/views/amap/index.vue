<template>
  <div class="map-search">
    <div class="search-box">
      <div class="search-input-wrapper">
        <div class="input-container">
          <input
            type="text"
            v-model="searchValue"
            placeholder="请输入地址"
            class="search-input"
            @keyup.enter="onSearch"
            @input="handleInput"
          >
          <!-- 搜索提示列表 -->
          <div class="search-tips" v-if="tipList.length">
            <div 
              v-for="(item, index) in tipList" 
              :key="index"
              class="tip-item"
              @click="handleSelectTip(item)"
            >
              <div class="name" v-html="highlightKeyword(item.name)"></div>
              <div class="district">{{ item.district }}</div>
            </div>
          </div>
        </div>
        <button class="search-btn" @click="onSearch">搜索</button>
      </div>
    </div>

    <!-- 地图容器 -->
    <div id="container"></div>

    <!-- 距离提示框 -->
    <div class="distance-info" v-if="distanceInfo">
      <van-cell :title="distanceInfo" />
    </div>
     <!-- 视图切换按钮 -->
    <div 
      v-if="!isLoading"
      class="view-toggle-btn"
      @click="toggleViewMode"
    >
      <span class="view-text">{{ is3D ? '3D' : '2D' }}</span>
    </div>

    <!-- 地址列表 -->
    <div class="address-list">
      <template v-if="!isLoading">
        <template v-if="addressList.length">
          <div 
            v-for="item in addressList"
            :key="item.id"
            class="address-item"
            @click="handleSelectAddress(item)"
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

    <!-- 路线规划按钮，添加显示条件 -->
    <!-- <div 
      v-if="showRouteBtn"
      class="route-btn" 
      @click="toggleRoutePanel"
      @touchstart.passive="dragStart"
      @touchmove.passive="drag"
      @touchend.passive="dragEnd"
      :style="btnStyle"
    >
      <van-icon name="guide-o" size="24" />
    </div>  -->

    <!-- 修改导航按钮 -->
    <div 
      class="nav-btn" 
      @touchstart.passive="dragStart"
      @touchmove.passive="drag"
      @touchend.passive="dragEnd"
      :style="btnStyle"
      @click="handleNavClick"
    >
      <van-icon name="guide-o" size="24" />
    </div>

    <!-- 添加地图选择弹出层 -->
    <van-popup
      v-model:show="showMapSelector"
      round
      position="bottom"
    >
      <div class="map-selector">
        <div class="selector-title">选择导航应用</div>
        <div class="map-options">
          <div class="map-option" @click="openMap('gaode')">
            <van-icon name="guide-o" size="24" color="#2aae67"/>
            <span>高德地图</span>
          </div>
          <div class="map-option" @click="openMap('baidu')">
            <van-icon name="location-o" size="24" color="#3385ff"/>
            <span>百度地图</span>
          </div>
          <div class="map-option" @click="openMap('tencent')">
            <van-icon name="location" size="24" color="#4b90fd"/>
            <span>腾讯地图</span>
          </div>
        </div>
        <div class="cancel-btn" @click="showMapSelector = false">取消</div>
      </div>
    </van-popup>

    <!-- 路线规划面板 -->
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

    <!-- 天气信息 -->
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
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import AMapLoader from '@amap/amap-jsapi-loader'
import { useToast } from '@/hooks/useToast'

const { showToast, showLoadingToast } = useToast()
function debounce(fn, delay) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

const searchValue = ref('')
const tipList = ref([])
let autoComplete = null
const addressList = ref([])
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

// 路线面板显示状态
const showRoutePanel = ref(false)

// 按钮显示控制
const showRouteBtn = ref(false)

const is3D = ref(true)  // 添加 3D 视图状态

const btnStyle = ref({
  top: '235px',
  right: '24px'
})

const isDragging = ref(false)
const startY = ref(0)
const startX = ref(0)
const startTop = ref(0)
const startRight = ref(0)


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

const showRoute = ref(true)

// 切换路线面板
// const toggleRoutePanel = (e) => {
//   if (isDragging.value) {
//     e.stopPropagation()
//     return
//   }
  
//   showRoutePanel.value = !showRoutePanel.value
// }

// 切换出行方式
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

// 修改清除路线
const clearAllRoutes = () => {
  window.driving && window.driving.clear()
  window.riding && window.riding.clear()
  window.walking && window.walking.clear()
}

// 修改显示选中路线
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

// 添加地图打点
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
    if (!searchValue.value.trim()) {
      showToast('请输入搜索地址')
      return Promise.reject('empty input')
    }

    // 关闭提示框
    tipList.value = []

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
        addressList.value = []
        reject(new Error('搜索失败'))
      }
    })
  })
}

// 修改计算所有路线信息
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

// 切换 2D/3D 视图
const toggleViewMode = () => {
  is3D.value = !is3D.value
  if (window.map) {
    const pitch = is3D.value ? 45 : 0  // 3D 时设置倾斜角度，2D 时设置为 0
    window.map.setPitch(pitch)  // 设置地图倾斜角度
  }
}

const weatherData = ref(null)

// 获取天气信息
const getWeatherInfo = () => {
  if (!window.AMap) return
  
  const weather = new AMap.Weather()
  weather.getLive('天津', (err, data) => {
    if (!err) {
      weatherData.value = data
    } else {
      console.error('获取天气信息失败：', err)
    }
  })
}

// 修改初始化地图
const initMap = async () => {
  const closeLoading = showLoadingToast({
    message: '加载中...',
    forbidClick: true
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
        'AMap.ControlBar',
        'AMap.GeometryUtil',
        'AMap.Driving',
        'AMap.Walking',
        'AMap.Riding',
        'AMap.Weather',
        'AMap.AutoComplete'
      ]
    })

    window.map = new AMap.Map('container', {
      viewMode: '3D',
      zoom: 14,
      center: initialPosition,
      pitch: 45
    })

    const scale = new AMap.Scale({
      position: {
        left: '5px',
        bottom: '5px'
      }
    })
    window.map.addControl(scale)

    const zoomControl = new AMap.ToolBar({
      position: {
        right: '28px',
        top: '100px'
      }
    })
    window.map.addControl(zoomControl)

    const controlBar = new AMap.ControlBar({
      position: {
        right: '0px',
        top: '0px'
      }
    });
    window.map.addControl(controlBar);

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

    // 获取天气信息
    getWeatherInfo()

    // 初始化 AutoComplete
    autoComplete = new AMap.AutoComplete({
      city: '天津',
      citylimit: true,
      input: ''  // 不绑定输入框，手动调用
    })

    closeLoading()
    isLoading.value = false
  } catch (e) {
    console.error('地图初始化失败：', e)
    showToast('地图加载失败')
    closeLoading()
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

// 当前位置的蓝色标记
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
  window.map.setZoom(14)

  // 显示路线面板
  showRoutePanel.value = true
  // 重置选中的状态
  currentTravelMode.value = ''
}

const handleInput = debounce(async () => {
  if (!searchValue.value.trim()) {
    tipList.value = []
    return
  }
  
  autoComplete.search(searchValue.value, (status, result) => {
    if (status === 'complete' && result.tips) {
      tipList.value = result.tips
    } else {
      tipList.value = []
    }
  })
}, 300)

// 高亮关键字
const highlightKeyword = (text) => {
  if (!searchValue.value.trim()) return text
  const keyword = searchValue.value.trim()
  const reg = new RegExp(keyword, 'gi')
  return text.replace(reg, match => `<span class="highlight">${match}</span>`)
}

// 选择提示项
const handleSelectTip = (tip) => {
  searchValue.value = tip.name
  tipList.value = []
  onSearch()
}

// 点击其他地方关闭提示列表
onMounted(() => {
  initMap()
  document.addEventListener('click', (e) => {
    const searchBox = document.querySelector('.search-box')
    if (!searchBox?.contains(e.target)) {
      tipList.value = []
    }
  })
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

const isLoading = ref(true)

// 修改打开地图的方法
const openMap = (mapType) => {
  if (!window.marker) {
    showToast('请先选择目的地')
    return
  }

  const position = window.marker.getPosition()
  const latitude = position.getLat()
  const longitude = position.getLng()
  const name = searchValue.value

  let url = ''
  let appName = ''
  switch (mapType) {
    case 'gaode':
      url = `androidamap://route/plan/?dlat=${latitude}&dlon=${longitude}&dname=${encodeURIComponent(name)}&dev=0&t=0`
      appName = '高德地图'
      break
    case 'baidu':
      url = `baidumap://map/direction?destination=${latitude},${longitude}&destination_name=${encodeURIComponent(name)}&mode=driving&coord_type=gcj02`
      appName = '百度地图'
      break
    case 'tencent':
      url = `qqmap://map/routeplan?type=drive&to=${encodeURIComponent(name)}&tocoord=${latitude},${longitude}&referer=myapp`
      appName = '腾讯地图'
      break
  }

  // 修改高德地图的网页版备用链接
  let webUrl = ''
  switch (mapType) {
    case 'gaode':
      // webUrl = `https://uri.amap.com/route/plan/?dlat=${latitude}&dlon=${longitude}&dname=${encodeURIComponent(name)}&dev=0&t=0`
      webUrl = `https://uri.amap.com/navigation?to=${longitude},${latitude},${encodeURIComponent(name)}&mode=car&coordinate=gaode&callnative=1`
      break
    case 'baidu':
      webUrl = `https://api.map.baidu.com/direction?destination=${latitude},${longitude}&destination_name=${encodeURIComponent(name)}&mode=driving&output=html&src=webapp.baidu.openAPIdemo`
      break
    case 'tencent':
      webUrl = `https://map.qq.com/dir/?type=drive&to=${encodeURIComponent(name)}&tocoord=${latitude},${longitude}&referer=myapp`
      break
  }

  // 先显示提示
  showToast(`正在尝试打开${appName}，如未安装将跳转至网页版`)

  // 延迟一下再尝试打开应用
  setTimeout(() => {
    if (isWeixinBrowser()) {
      // 在微信中直接使用 URL Scheme
      window.location.href = url
      
      // 如果几秒后还在当前页面，说明没有安装对应的 APP，跳转到网页版
      setTimeout(() => {
        if (document.hidden) return  // 如果页面隐藏了，说明已经成功打开了应用
        window.location.href = webUrl
      }, 2500)
    } else {
      // 非微信环境使用 window.open
      const openApp = window.open(url)
      setTimeout(() => {
        if (openApp && !openApp.closed) {
          openApp.close()
          window.location.href = webUrl
        }
      }, 2500)
    }
  }, 1500) // 延迟 1.5 秒，让用户能看到提示

  // 关闭选择器
  showMapSelector.value = false
}

// 添加地图选择器的显示状态
const showMapSelector = ref(false)

// 添加检测是否在微信浏览器中的方法
const isWeixinBrowser = () => {
  return /MicroMessenger/i.test(navigator.userAgent)
}

// 添加导航按钮点击处理方法
const handleNavClick = () => {
  if (!window.marker) {
    showToast('请先选择目的地')
    return
  }
  showMapSelector.value = true
}
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
    background: #fff;
    padding: 8px 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    .search-input-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .input-container {
        flex: 1;
        display: flex;
        align-items: center;
        height: 36px;
        background: #f7f8fa;
        border-radius: 4px;
        position: relative;  // 为提示列表定位
        
        .search-tips {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: #fff;
          border-radius: 4px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
          margin-top: 4px;
          max-height: 300px;
          overflow-y: auto;
          z-index: 1000;

          .tip-item {
            padding: 10px 12px;
            cursor: pointer;

            &:hover {
              background: #f5f5f5;
            }

            .name {
              font-size: 14px;
              color: #323233;
              margin-bottom: 2px;

              :deep(.highlight) {
                color: #ee0a24;
              }
            }

            .district {
              font-size: 12px;
              color: #969799;
            }
          }
        }
      }

      .search-input {
        flex: 1;
        height: 100%;
        border: none;
        padding: 0 12px;
        font-size: 14px;
        background: transparent;
        outline: none;

        &:focus {
          &::placeholder {
            color: #c8c9cc;
          }
        }

        &::placeholder {
          color: #969799;
        }
      }

      .search-btn {
        padding: 0 16px;
        height: 36px;
        color: #1989fa;
        font-size: 14px;
        background: transparent;
        border: none;
        cursor: pointer;
        white-space: nowrap;

        &:active {
          opacity: 0.8;
        }
      }
    }
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
    z-index: 99999;
    cursor: pointer;
    touch-action: none;
    transition: transform 0.2s;

    &:active {
      transform: scale(0.95);
      background: #f5f5f5;
    }
  }

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

  .view-toggle-btn {
    position: fixed;
    top: 70px;
    left: 5px;
    min-width: 40px;
    height: 40px;
    padding: 0 12px;
    background: #fff;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 99;
    cursor: pointer;
    user-select: none;
    
    .view-text {
      font-size: 14px;
      font-weight: 500;
      color: #323233;
    }

    &:active {
      background: #f5f5f5;
    }
  }

  .weather-info {
    position: fixed;
    top: 120px;
    left: 5px;
    background: rgba(255, 255, 255, 0.9);
    padding: 10px;
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

  // 添加导航按钮样式
  .nav-btn {
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
    right: 24px;
    top: 185px; // 位置在路线规划按钮上方
    transition: transform 0.2s;

    &:active {
      transform: scale(0.95);
      background: #f5f5f5;
    }
  }

  // 添加地图选择器样式
  .map-selector {
    padding: 16px;

    .selector-title {
      text-align: center;
      font-size: 16px;
      color: #323233;
      margin-bottom: 16px;
    }

    .map-options {
      display: flex;
      justify-content: space-around;
      padding: 8px 0;

      .map-option {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 12px;
        cursor: pointer;

        span {
          margin-top: 8px;
          font-size: 14px;
          color: #323233;
        }

        &:active {
          background-color: #f5f5f5;
          border-radius: 8px;
        }
      }
    }

    .cancel-btn {
      margin-top: 16px;
      text-align: center;
      padding: 12px;
      color: #323233;
      font-size: 14px;
      background: #f7f8fa;
      border-radius: 8px;
      cursor: pointer;

      &:active {
        background: #e8e8e8;
      }
    }
  }
}

// 修改滑动动画
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
