
import Vue from 'vue'
import axios from 'axios'

export function editDelete(fnDel) {
  Vue.prototype.$confirm('确认删除吗?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async() => {
    fnDel()
  }).catch(() => {
    Vue.prototype.$message({
      type: 'info',
      message: '已取消删除'
    })
  })
}

export function confirmDelete(fnDel) {
  Vue.prototype.$confirm('确认删除吗?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async() => {
    fnDel()
  }).catch(() => {
    Vue.prototype.$message({
      type: 'info',
      message: '已取消删除'
    })
  })
}

export function confirmUpload(fnUpload) {
  Vue.prototype.$confirm('确认上传吗?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async() => {
    fnUpload()
  }).catch(() => {
    // Vue.prototype.$message({
    //   type: 'info',
    //   message: '已取消上传'
    // })
  })
}

export function confirmEdit(fnUpload) {
  Vue.prototype.$confirm('确认修改吗?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async() => {
    fnUpload()
  }).catch(() => {
    // Vue.prototype.$message({
    //   type: 'info',
    //   message: '已取消上传'
    // })
  })
}

export function readFile2(filePath) {
  // 创建一个新的xhr对象
  let xhr = null
  if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest()
  } else {
    // eslint-disable-next-line
    xhr = new ActiveXObject('Microsoft.XMLHTTP')
  }

  // xhr.onreadystatechange = function() {
  //   console.log(xhr.readyState)
  //   if (xhr.readyState === 4) {
  //     if (xhr.status === 200) {
  //       console.log(xhr.responseText)
  //     } else {
  //       // 错误处理
  //       // console.log('Error', xhr.statusText)
  //     }
  //   } else if (xhr.readyState === 1) {
  //     // console.log(xhr.readyState)
  //   }
  // }

  const okStatus = document.location.protocol === 'file' ? 0 : 200
  xhr.open('GET', filePath + '?' + new Date().getTime(), false)
  xhr.overrideMimeType('text/html;charset=utf-8')
  xhr.send(null)
  return xhr.status === okStatus ? xhr.responseText : null
}
export function readFile(filePath, cbkFun) {
  axios.get(filePath + '?' + new Date().getTime())
    .then(function(res) {
      cbkFun(res.data)
    }).catch(function(error) {
      console.log(error)
    })
}

/**
 * [过滤对象]
 * @param  obj [过滤前数据]
 * @param  arr [过滤条件,去除arr中的属性，字符串或数组]
 */
export function filterObj(obj, arr) {
  if (typeof (obj) !== 'object') {
    return null
  }

  if (!Array.isArray(arr)) {
    return filterObj(obj, [arr])
  }

  const result = {}
  Object.keys(obj).filter((key) => (!arr.includes(key))).forEach((key) => {
    result[key] = obj[key]
  })
  return result
}
