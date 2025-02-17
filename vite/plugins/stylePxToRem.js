// 默认参数，针对移动端调整
let defaultsProp = {
  unitToConvert: 'px',
  viewportWidth: 430, // 设计稿宽度为375px
  unitPrecision: 5,
  viewportUnit: 'rem', // 单位改为rem
  fontViewportUnit: 'rem', // 字体单位也改为rem
  minPixelValue: 1
}

function toFixed(number, precision) {
  var multiplier = Math.pow(10, precision + 1),
    wholeNumber = Math.floor(number * multiplier)
  return (Math.round(wholeNumber / 10) * 10) / multiplier
}

function createPxReplace(viewportSize, minPixelValue, unitPrecision, viewportUnit) {
  return function ($0, $1) {
    if (!$1) return
    var pixels = parseFloat($1)
    if (pixels <= minPixelValue) return
    // 由于1rem = 10vw, 根据设计稿宽度计算px转rem时, 我们使用viewportSize * 10 / 100的转换系数
    return toFixed((pixels / viewportSize) * (100 / 10), unitPrecision) + viewportUnit
  }
}

const templateReg = /<template>([\s\S]+)<\/template>/gi
const pxGlobalReg = /(\d+)px/gi

// 生成插件的工厂方法
const pluginGenerator = (customOptions = defaultsProp) => {
  // 返回插件
  return {
    // 插件名称
    name: 'postcss-pxtorem',
    // transform 钩子
    async transform(code, id) {
      if (/.vue$/.test(id)) {
        let _source = ''
        if (templateReg.test(code)) {
          _source = code.match(templateReg)[0]
        }
        if (pxGlobalReg.test(_source)) {
          let $_source = _source.replace(
            pxGlobalReg,
            createPxReplace(
              customOptions.viewportWidth,
              customOptions.minPixelValue,
              customOptions.unitPrecision,
              customOptions.viewportUnit
            )
          )

          code = code.replace(_source, $_source)
        }
      }
      return { code }
    }
  }
}

export default pluginGenerator
