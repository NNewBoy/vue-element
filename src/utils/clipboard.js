import Vue from 'vue'
import Clipboard from 'clipboard'

const clipboarData = []

export function copyToClipboard(key, data) {
  clipboarData[key] = JSON.stringify(data)
  Vue.prototype.$notify({
    title: 'Success',
    message: '复制成功',
    type: 'success',
    duration: 2000
  })
}

export function pasteFromClipboard(key) {
  if (!clipboarData.hasOwnProperty(key)) {
    Vue.prototype.$notify({
      title: 'Error',
      message: '无复制内容',
      type: 'error',
      duration: 2000
    })
    return null
  }
  Vue.prototype.$notify({
    title: 'Success',
    message: '粘贴成功',
    type: 'success',
    duration: 2000
  })

  return JSON.parse(clipboarData[key])
}

export function hasKeyInClipboard(key) {
  return clipboarData.hasOwnProperty(key)
}

function clipboardSuccess() {
  Vue.prototype.$message({
    message: 'Copy successfully',
    type: 'success',
    duration: 1500
  })
}

function clipboardError() {
  Vue.prototype.$message({
    message: 'Copy failed',
    type: 'error'
  })
}

export default function handleClipboard(text, event) {
  const clipboard = new Clipboard(event.target, {
    text: () => text
  })
  clipboard.on('success', () => {
    clipboardSuccess()
    clipboard.destroy()
  })
  clipboard.on('error', () => {
    clipboardError()
    clipboard.destroy()
  })
  clipboard.onClick(event)
}
