import axios from 'axios'
import { showFailToast } from 'vant'
import useAppStore from '@/stores/modules/app'
// import { setToken } from '@/utils/auth'
class PromiseState {
  constructor() {
    this.p = false // 进行进行中标准，pending, processing
    this.o = false // 执行成功 ok 标志, promise resolved
    this.e = false // 执行结果报错出现异常 error 标志, promise rejected，可能是 Error 类对象
    this.c = Number.NaN // code 错误码，成功为 0
    this.m = '' // message 调用结果说明，通常出错时给出
    this.d = {} // data 调用结果响应，初始化为空对象
    this.s = 0 // sequence 第几次调用
    this.b = undefined // begin time
    this.f = undefined // finish time
    // 以下是可选成员，用于关联请求相关信息
    this.t = '' // type
    this.u = '' // url, path
    this.up = '' // url prefix for ipu background worker
    this.r = {} // request
  }
}
// 创建 axios 实例
const defaultAPI = axios.create({
  timeout: 1000 * 60 * 10,
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// axios 拦截器配置
const whiteUrl = [
  // '/UnifyAuthority/authentication/login',
  // '/UnifyAuthority/authentication/login/cas'
]
defaultAPI.interceptors.request.use((configs) => {
  const token = localStorage.getItem('Authentication')
  if (token && !whiteUrl.includes(configs.url)) {
    configs.headers.Authentication = token
  }
  return configs
})
export function newStore() {
  return reactive(new PromiseState())
}
export function spost(store, path, data, options = {}) {
  const {
    method = 'post',
    responseType = 'json',
    baseURL = defaultAPI.defaults.baseURL,
    headers = {}
  } = options
  // 创建一个特定配置的 axios 实例
  const API = axios.create({
    baseURL,
    responseType,
    timeout: defaultAPI.defaults.timeout,
    headers: {
      ...defaultAPI.defaults.headers,
      ...headers
    }
  })
  // 继承 defaultAPI 的拦截器
  API.interceptors.request.use(defaultAPI.interceptors.request.handlers[0].fulfilled)
  return new Promise((resolve, reject) => {
    store.b = new Date()
    store.t = 'ajax'
    store.u = path
    store.r = data
    store.p = true
    store.o = false
    store.e = false
    store.m = ''
    store.d = {}
    store.s += 1
    let bizHead = { ...options.bizHead }
    if (!options.bizHead) {
      bizHead = {
        appId: useAppStore().urlParams?.appId,
        sysId: useAppStore().urlParams?.sysId,
        staffId: useAppStore().urlParams?.staffId,
        staffName: useAppStore().urlParams?.staffName,
        departId: useAppStore().urlParams?.departId,
        timestamp: useAppStore().urlParams?.timestamp,
        token: useAppStore().urlParams?.token,
        orderId: useAppStore().urlParams?.orderId,
        menuId: useAppStore().urlParams?.menuId,
        detailAddress: useAppStore().urlParams?.detailAddress,
        contactPhone: useAppStore().urlParams?.contactPhone,
        iomOrderId: useAppStore().urlParams?.iomOrderId,
        psptId: useAppStore().urlParams?.psptId
      }
    }
    data =
      {
        bizHead,
        bizBody: {
          psptId: useAppStore().urlParams?.psptId,
          addressId: useAppStore().urlParams?.addressId,
          serialNumber: useAppStore().urlParams?.serialNumber,
          ...data
        }
      } || {}
    // 根据 method 决定是使用 post 还是 get
    const request = method === 'get' ? API.get(path, { params: data }) : API.post(path, data)
    request
      .then((res) => {
        //token续时
        // if (res.headers?.authentication) {
        //   console.log('续时了')
        //   useUserStore().$patch((state) => {
        //     state.authentication = res.headers.authentication
        //   })
        //   // setToken(res.headers.authentication)
        // }
        console.log('then', res)
        const d = res.data
        store.f = new Date()
        store.p = false
        store.c = method === 'post' ? res.data.resData.rsp_code : res.status
        store.d = d.resData || d
        if (store.c === '0000') {
          store.o = true
          store.e = false
          store.m = d.message
          resolve(store)
        } else {
          store.o = false
          store.e = true
          store.m = res.data.resData.rsp_desc || '服务调用异常'
          showFailToast(store.m)
          // ElMessage({
          //   message: store.m,
          //   type: 'error'
          // })
          reject(store)
        }
        // this.$emit(`ajax:${store.u}`, store);
      })
      .catch((err) => {
        console.log('catch', err)
        // if (err.response?.headers?.authentication) {
        //   console.log('续时了')
        //   useUserStore().$patch((state) => {
        //     state.authentication = err.response.headers.authentication
        //   })
        //   // setToken(err.response.headers.authentication)
        // }
        store.f = new Date()
        store.p = false
        store.o = false
        store.e = true
        store.c = -2
        if (err.response?.status === 404) {
          store.m = '后台服务暂未开通'
        } else {
          store.m = err.response?.data?.message || '服务调用异常'
        }
        showFailToast(store.m)
        store.d = err.response?.data
        reject(store)
      })
  })
}

export function wzwSpost(store, path, data, options = {}) {
  console.log('env', import.meta.env)
  const {
    method = 'post',
    responseType = 'json',
    baseURL = import.meta.env.VITE_WZWAPI_URL
  } = options
  // 创建一个特定配置的 axios 实例
  const API = axios.create({
    baseURL,
    responseType,
    timeout: 1000 * 60,
    headers: {
      ...defaultAPI.defaults.headers,
      'Access-Control-Allow-Origin': '*',
      SessionId: useAppStore().urlParams?.sessionId,
      ZwProject: import.meta.env.MODE === 'development' ? '1' : ''
    }
  })
  // 继承 defaultAPI 的拦截器
  API.interceptors.request.use(defaultAPI.interceptors.request.handlers[0].fulfilled)
  return new Promise((resolve, reject) => {
    store.b = new Date()
    store.t = 'ajax'
    store.u = path
    store.r = data
    store.p = true
    store.o = false
    store.e = false
    store.m = ''
    store.d = {}
    store.s += 1
    // 根据 method 决定是使用 post 还是 get
    const request = method === 'get' ? API.get(path, { params: data }) : API.post(path, data)
    request
      .then((res) => {
        //token续时
        // if (res.headers?.authentication) {
        //   console.log('续时了')
        //   useUserStore().$patch((state) => {
        //     state.authentication = res.headers.authentication
        //   })
        //   // setToken(res.headers.authentication)
        // }
        console.log('then', res)
        store.f = new Date()
        store.p = false
        store.c = res.status
        store.d = res.data
        if (store.c === 200) {
          store.o = true
          store.e = false
          store.m = res.msg
          resolve(store)
        } else {
          store.o = false
          store.e = true
          store.m = res.msg || '服务调用异常'
          showFailToast(store.m)
          // ElMessage({
          //   message: store.m,
          //   type: 'error'
          // })
          reject(store)
        }
        // this.$emit(`ajax:${store.u}`, store);
      })
      .catch((err) => {
        console.log('catch', err)
        // if (err.response?.headers?.authentication) {
        //   console.log('续时了')
        //   useUserStore().$patch((state) => {
        //     state.authentication = err.response.headers.authentication
        //   })
        //   // setToken(err.response.headers.authentication)
        // }
        store.f = new Date()
        store.p = false
        store.o = false
        store.e = true
        store.c = -2
        if (err.code === 404) {
          store.m = '后台服务暂未开通'
        } else {
          store.m = err.msg || '服务调用异常'
        }
        showFailToast(store.m)
        store.d = err.data
        reject(store)
      })
  })
}
