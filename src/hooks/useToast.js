import { ref } from 'vue'

export function useToast() {
  const visible = ref(false)
  const message = ref('')
  const forbidClick = ref(false)

  let toastTimer = null

  const showToast = (options) => {
    // 清除之前的定时器
    if (toastTimer) {
      clearTimeout(toastTimer)
      const oldToast = document.querySelector('.custom-toast')
      if (oldToast) {
        document.body.removeChild(oldToast)
      }
    }

    // 处理参数
    if (typeof options === 'string') {
      message.value = options
      forbidClick.value = false
    } else {
      message.value = options.message
      forbidClick.value = options.forbidClick || false
    }

    // 创建 toast 元素
    const toast = document.createElement('div')
    toast.className = 'custom-toast'
    toast.textContent = message.value

    // 如果禁止点击，添加遮罩
    if (forbidClick.value) {
      const overlay = document.createElement('div')
      overlay.className = 'toast-overlay'
      document.body.appendChild(overlay)
    }

    document.body.appendChild(toast)
    visible.value = true

    // 强制重绘
    toast.offsetHeight
    toast.style.opacity = '1'

    // 设置定时器移除 toast
    const duration = typeof options === 'object' ? options.duration || 2500 : 2500
    toastTimer = window.setTimeout(() => {
      toast.classList.add('fade-out')
      setTimeout(() => {
        document.body.removeChild(toast)
        if (forbidClick.value) {
          const overlay = document.querySelector('.toast-overlay')
          if (overlay) {
            document.body.removeChild(overlay)
          }
        }
        visible.value = false
        forbidClick.value = false
      }, 200)
    }, duration)
  }

  // loading toast
  const showLoadingToast = (options) => {
    console.log('显示 loading:', options)
    const loadingOptions = typeof options === 'string'
      ? { message: options, forbidClick: true }
      : { ...options, forbidClick: true }

    const toast = document.createElement('div')
    toast.className = 'custom-toast loading-toast'

    const spinner = document.createElement('div')
    spinner.className = 'loading-spinner'
    toast.appendChild(spinner)

    if (loadingOptions.message) {
      const messageDiv = document.createElement('div')
      messageDiv.className = 'loading-message'
      messageDiv.textContent = loadingOptions.message
      toast.appendChild(messageDiv)
    }

    if (loadingOptions.forbidClick) {
      const overlay = document.createElement('div')
      overlay.className = 'toast-overlay'
      document.body.appendChild(overlay)
    }

    document.body.appendChild(toast)
    // 强制重绘
    toast.offsetHeight
    toast.style.opacity = '1'

    return () => {
      toast.classList.add('fade-out')
      setTimeout(() => {
        document.body.removeChild(toast)
        const overlay = document.querySelector('.toast-overlay')
        if (overlay) {
          document.body.removeChild(overlay)
        }
      }, 200)
    }
  }

  return {
    showToast,
    showLoadingToast
  }
} 