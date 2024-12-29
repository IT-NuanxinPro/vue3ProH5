<template>
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
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  autoComplete: Object
})

const emit = defineEmits(['search', 'select'])

const searchValue = ref('')
const tipList = ref([])

// 防抖函数
function debounce(fn, delay) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

// 处理输入
const handleInput = debounce(async () => {
  if (!searchValue.value.trim()) {
    tipList.value = []
    return
  }
  
  props.autoComplete.search(searchValue.value, (status, result) => {
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
  emit('select', tip)
}

const onSearch = () => {
  emit('search', searchValue.value)
}

// 点击其他地方关闭提示列表
onMounted(() => {
  document.addEventListener('click', (e) => {
    const searchBox = document.querySelector('.search-box')
    if (!searchBox?.contains(e.target)) {
      tipList.value = []
    }
  })
})
</script>

<style lang="scss" scoped>
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
      position: relative;

      .search-input {
        width: 100%;
        height: 36px;
        padding: 0 12px;
        border: none;
        background: #f7f8fa;
        border-radius: 4px;
        font-size: 14px;
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
</style> 