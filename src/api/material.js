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

export function getMat(use, text, query) {
  const param = { token: getToken(), use: use, text: text }
  for (const key in query) {
    param[key] = query[key]
  }
  return request({
    url: '/mat/list',
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
    params: { token: getToken(), data }
  })
}

export function addMat(data) {
  return request({
    url: '/mat/add',
    method: 'post',
    params: { token: getToken(), data } // 返回新增的id
  })
}

export function deleteMat(id) {
  return request({
    url: '/mat/delete',
    method: 'post',
    params: { token: getToken(), id }
  })
}

export function getSetCtrl() {
  return request({
    url: '/mat/setctrl/list',
    method: 'get',
    params: { token: getToken() }
  })
}

export function enableSetCtrl(name, enable) {
  return request({
    url: '/mat/setctrl/enable',
    method: 'post',
    params: { token: getToken(), obj: name, enable: enable }
  })
}

export function deleteSetCtrl(name) {
  return request({
    url: '/mat/setctrl/delete',
    method: 'post',
    params: { token: getToken(), obj: name }
  })
}

export function addSetCtrl(obj, mainObj) {
  return request({
    url: '/mat/setctrl/add',
    method: 'post',
    params: { token: getToken(), obj: obj, main_obj: mainObj }
  })
}

export function editSetCtrl(obj, mainObj) {
  return request({
    url: '/mat/setctrl/edit',
    method: 'post',
    params: { token: getToken(), obj: obj, main_obj: mainObj }
  })
}

export function getSelMatGroup() {
  return request({
    url: '/mat/selmatgroup/list',
    method: 'get',
    params: { token: getToken() }
  })
}

export function deleteSelMatGroup(id) {
  return request({
    url: '/mat/selmatgroup/delete',
    method: 'get',
    params: { token: getToken(), id }
  })
}

export function editSelMatGroup(data) {
  return request({
    url: '/mat/selmatgroup/edit',
    method: 'get',
    params: { token: getToken(), data }
  })
}

export function addSelMatGroup(data) {
  return request({
    url: '/mat/selmatgroup/add',
    method: 'get',
    params: { token: getToken(), data }
  })
}

