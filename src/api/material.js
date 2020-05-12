import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export function getCatalog() {
  return request({
    url: '/mat/catalog',
    method: 'get'
    // params: { token: getToken() }
  }).then((data) => {
    return data.data
  })
}

export function getCatalogByObjName(objname) {
  return request({
    url: '/mat/catalog/objname',
    method: 'get',
    params: { objname }
  }).then((data) => {
    return data.data
  })
}

export function getCatalogByProductPros(dir1, dir2, dir3, dir4, modelno) {
  return request({
    url: '/mat/catalog/productprops',
    method: 'get',
    params: { dir1, dir2, dir3, dir4, modelno }
  }).then((data) => {
    return data.data
  })
}

export function getCatalogByLineType(linetype, linestyle) {
  return request({
    url: '/mat/catalog/linetype',
    method: 'get',
    params: { linetype, linestyle }
  }).then((data) => {
    return data.data
  })
}

export function getMat(use, text, query) {
  const param = { token: getToken(), use: use, text: text }
  for (const key in query) {
    param[key] = query[key]
  }
  return request({
    // url: '/mat/list', // material页面
    url: '/mat/list2',
    method: 'get',
    params: param
  }).then((data) => {
    return data.data
  })
}

export function updateMat(data) {
  return request({
    url: '/mat/update',
    method: 'post',
    params: { data }
  })
}

export function addMat(data) {
  return request({
    url: '/mat/add',
    method: 'post',
    params: { data } // 返回新增的id
  })
}

export function importMat(data) {
  return request({
    url: '/mat/import',
    method: 'post',
    data: { data } // ,
    // transformRequest: [function(data) {
    //   return data
    // }]
  })
}

export function deleteMat(id) {
  return request({
    url: '/mat/delete',
    method: 'post',
    params: { id }
  })
}

export function getSetCtrl() {
  return request({
    url: '/mat/setctrl/list',
    method: 'get'
  })
}

export function enableSetCtrl(name, enable) {
  return request({
    url: '/mat/setctrl/enable',
    method: 'post',
    params: { obj: name, enable: enable }
  })
}

export function deleteSetCtrl(name) {
  return request({
    url: '/mat/setctrl/delete',
    method: 'post',
    params: { obj: name }
  })
}

export function addSetCtrl(obj, mainObj) {
  return request({
    url: '/mat/setctrl/add',
    method: 'post',
    params: { obj: obj, main_obj: mainObj }
  })
}

export function editSetCtrl(obj, mainObj) {
  return request({
    url: '/mat/setctrl/edit',
    method: 'post',
    params: { obj: obj, main_obj: mainObj }
  })
}

export function getSelMatGroup() {
  return request({
    url: '/mat/selmatgroup/list',
    method: 'get'
  })
}

export function deleteSelMatGroup(id) {
  return request({
    url: '/mat/selmatgroup/delete',
    method: 'post',
    params: { id }
  })
}

export function editSelMatGroup(data) {
  return request({
    url: '/mat/selmatgroup/update',
    method: 'post',
    params: { data }
  })
}

export function addSelMatGroup(data) {
  return request({
    url: '/mat/selmatgroup/add',
    method: 'post',
    params: { data }
  })
}

// 扩展材料
export function getExtraSet() {
  return request({
    url: '/mat/extraset/list',
    method: 'get'
  })
}

export function deleteExtraSet(id) {
  return request({
    url: '/mat/extraset/delete',
    method: 'post',
    params: { id }
  })
}

export function editExtraSet(data) {
  return request({
    url: '/mat/extraset/update',
    method: 'post',
    params: { data }
  })
}

export function addExtraSet(data) {
  return request({
    url: '/mat/extraset/add',
    method: 'post',
    params: { data }
  })
}
