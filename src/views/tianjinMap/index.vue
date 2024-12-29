<template>
  <div class="map-container">
    <div class="map-card">
      <div class="map-content">
        <div class="six-area-map">
          <div id="sixAreaMap" ref="sixAreaMapRef"></div>
        </div>
        <div class="main-map">
          <div id="map" ref="mapRef"></div>
        </div>
        <div class="heritage-card">
          <div class="number">0个</div>
          <div class="text">
            <div>人类非遗</div>
            <div>项目</div>
          </div>
        </div>
      </div>
    </div>
    <div class="map-info"></div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts'
import tianjinJson from './tianjin.json'
import sixAreaJson from './sixArea.json'

const mapRef = ref(null)
const sixAreaMapRef = ref(null)
let myChart = null
let sixAreaChart = null

const areaColors = {
  '和平区': '#1B3B6B',
  '河东区': '#B4C3C5',
  '河西区': '#8B4A34',
  '南开区': '#C17F59',
  '河北区': '#6B7C76',
  '红桥区': '#4A5C9E',
  '滨海新区': '#95A6D7',
  '东丽区': '#A3815F',
  '西青区': '#D4B08C',
  '津南区': '#8F9779',
  '北辰区': '#2F4858',
  '武清区': '#7E6148',
  '宝坻区': '#A4CABC',
  '宁河区': '#D49464',
  '静海区': '#849B87',
  '蓟州区': '#536B7A'
}

// 市内六区列表
const innerCityDistricts = ['和平区', '河东区', '河西区', '南开区', '河北区', '红桥区']

// 生成区域配置
const generateRegions = () => {
  return Object.entries(areaColors).map(([name, color]) => ({
    name,
    itemStyle: { areaColor: color },
    label: { 
      show: !innerCityDistricts.includes(name),  // 非六区显示标签
    },
    // 为六区添加特殊配置
    ...(innerCityDistricts.includes(name) ? {
      select: {
        label: { show: false }  // 选中时也不显示标签
      },
      emphasis: {
        label: { show: false }  // 悬浮时也不显示标签
      }
    } : {})
  }))
}

// 地图基础样式配置
const baseMapStyle = {
  label: {
    show: true,
    color: '#fff',
    position: 'center',
    fontSize: 11,
    fontWeight: 'normal'
  },
  select: {
    itemStyle: {
      areaColor: '#BB7D31',
      borderColor: '#fff',
      borderWidth: 2
    },
    label: {
      show: true,
      color: '#fff',
      fontSize: 11
    }
  },
  emphasis: {
    label: {
      show: true,
      color: '#fff',
      fontSize: 11
    }
  }
}

// 天津市完整地图配置
const option = {
  backgroundColor: '#D0C5AD',
  geo: {
    map: 'tianjin',
    roam: false,
    selectedMode: 'single',
    ...baseMapStyle,
    // top: '2%',
    // left: '2%',
    // right: '30%',
    // bottom: '2%',
    layoutCenter: ['35%', '50%'],
    layoutSize: '100%',
    regions: generateRegions()
  },
  series: [{
    type: 'map',
    map: 'tianjin',
    geoIndex: 0,
    data: []
  }]
}

// 市内六区地图配置
const sixAreaOption = {
  backgroundColor: '#D0C5AD',
  geo: {
    map: 'sixArea',
    roam: false,
    selectedMode: 'single',
    ...baseMapStyle,
    zoom: 1,
    layoutCenter: ['50%', '55%'],
    layoutSize: '100%',
    regions: innerCityDistricts.map(name => ({
      name,
      itemStyle: { areaColor: areaColors[name] },
      label: { 
        show: true,
        color: '#fff',
        position: 'center',
        fontSize: 11
      }
    }))
  },
  series: [{
    type: 'map',
    map: 'sixArea',
    geoIndex: 0,
    data: []
  }]
}

// 初始化地图
const initMap = () => {
  if (!mapRef.value || !sixAreaMapRef.value) return
  
  myChart = echarts.init(mapRef.value)
  sixAreaChart = echarts.init(sixAreaMapRef.value)
  
  try {
    echarts.registerMap('tianjin', tianjinJson)
    echarts.registerMap('sixArea', sixAreaJson)
    
    myChart.setOption(option)
    sixAreaChart.setOption(sixAreaOption)
    
    // 记录当前选中的区域
    let currentSelected = ''
    
    // 天津市地图点击事件
    myChart.on('click', (params) => {
      console.log('点击的区域名称:', params.name)
      
      // 如果点击的是已选中的区域，不做任何操作
      if (params.name === currentSelected) {
        // 重新触发选中状态
        myChart.dispatchAction({
          type: 'select',
          name: params.name
        })
        return
      }
      
      // 更新当前选中的区域
      currentSelected = params.name
      
      // 如果点击的是市内六区，同步高亮六区地图对应区域
      if (innerCityDistricts.includes(params.name)) {
        sixAreaChart.dispatchAction({
          type: 'select',
          name: params.name
        })
      }
    })
    
    // 六区地图点击事件
    sixAreaChart.on('click', (params) => {
      console.log('点击的六区名称:', params.name)
      
      // 如果点击的是已选中的区域，不做任何操作
      if (params.name === currentSelected) {
        // 重新触发选中状态
        sixAreaChart.dispatchAction({
          type: 'select',
          name: params.name
        })
        return
      }
      
      // 更新当前选中的区域
      currentSelected = params.name
      
      // 同步高亮天津市地图对应区域
      myChart.dispatchAction({
        type: 'select',
        name: params.name
      })
    })
    
    // 自适应大小
    window.addEventListener('resize', () => {
      myChart?.resize()
      sixAreaChart?.resize()
    })
  } catch (error) {
    console.error('地图加载失败:', error)
  }
}

onMounted(() => {
  initMap()
})

onUnmounted(() => {
  myChart?.dispose()
  sixAreaChart?.dispose()
  window.removeEventListener('resize', () => {
    myChart?.resize()
    sixAreaChart?.resize()
  })
})
</script>

<style lang="scss" scoped>
.map-container {
  width: 100vw;
  height: 100vh;

  .map-card {
    width: 100%;
    height: 50vh;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    position: relative;

    .map-content {
      width: 100%;
      height: 100%;
      position: relative;

      .six-area-map {
        position: absolute;
        // top: 15%;
        right: 0;
        width: 170px;
        height: 170px;
        z-index: 2;

        #sixAreaMap {
          width: 100%;
          height: 100%;
        }
      }

      .main-map {
        width: 100%;
        height: 100%;
        z-index: 1;

        #map {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}

.heritage-card {
  position: absolute;
  right: 15px;
  top: 65%;
  width: 110px;
  height: 110px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1.5px solid #8B4A34;
  z-index: 3;  // 确保在最上层
  .number {
    width: 100%;
    font-size: 20px;
    color: #fff;
    line-height: 2;
    background-color: #8B4A34;
    text-align: center;
  }

  .text {
    width: 100%;
    flex: 1;
    font-size: 16px;
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}
</style>

