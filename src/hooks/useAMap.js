import AMapLoader from '@amap/amap-jsapi-loader'
import { useToast } from '@/hooks/useToast'

export function useAMap() {
  const { showToast, showLoadingToast } = useToast()

  // 初始化地图
  const initMap = async (options = {}) => {
    const closeLoading = showLoadingToast({
      message: '加载中...',
      forbidClick: true
    })

    try {
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
        center: options.initialPosition,
        pitch: 45
      })

      // 添加控件
      initControls()

      // 初始化服务
      initServices()

      closeLoading()
      return true
    } catch (e) {
      console.error('地图初始化失败：', e)
      showToast('地图加载失败')
      closeLoading()
      return false
    }
  }

  // 初始化控件
  const initControls = () => {
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
    })
    window.map.addControl(controlBar)
  }

  // 初始化服务
  const initServices = () => {
    window.placeSearch = new AMap.PlaceSearch({
      city: '天津',
      pageSize: 10,
      pageIndex: 1
    })

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
  }

  // 清理地图
  const destroyMap = () => {
    if (window.map) {
      window.map.destroy()
      window.map = null
      window.marker = null
      window.currentLocationMarker = null
      window.placeSearch = null
      window.driving = null
      window.riding = null
      window.walking = null
    }
  }

  return {
    initMap,
    destroyMap
  }
} 