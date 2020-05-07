import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export function getCatalog() {
  return request({
    url: '/doorstyle/catalog',
    method: 'get',
    params: { token: getToken() }
  }).then((data) => {
    return data.data
  })
}

export function getColorList(doorstyle) {
  return request({
    url: '/doorstyle/list',
    method: 'get',
    params: { token: getToken(), doorstyle }
  }).then((data) => {
    return data.data
  })
}

export function updateDoorStyle(data) {
  return request({
    url: '/doorstyle/update',
    method: 'post',
    params: { data }
  })
}

export function deleteDoorStyle(id) {
  return request({
    url: '/doorstyle/delete',
    method: 'post',
    params: { id }
  })
}

export function addDoorStyle(data) {
  return request({
    url: '/doorstyle/add',
    method: 'post',
    params: { data } // 返回新增的id
  })
}

// DoorShape
export function getDoorShapeList(query) {
  const param = { }
  for (const key in query) {
    param[key] = query[key]
  }
  return request({
    url: '/doorshape/list',
    method: 'get',
    params: param
  })
}

export function updateDoorShape(data) {
  return request({
    url: '/doorshape/update',
    method: 'post',
    params: { data }
  })
}

export function deleteDoorShape(id) {
  return request({
    url: '/doorshape/delete',
    method: 'post',
    params: { id }
  })
}

export function addDoorShape(data) {
  return request({
    url: '/doorshape/add',
    method: 'post',
    params: { data } // 返回新增的id
  })
}

// DoorInner
export function getInnerCatalog() {
  return request({
    url: '/doorinner/catalog',
    method: 'get'
  }).then((data) => {
    return data.data
  })
}

export function getDoorInnerList(doorstyle) {
  return request({
    url: '/doorinner/list',
    method: 'get',
    params: { doorstyle }
  }).then((data) => {
    return data.data
  })
}

export function updateDoorInner(data) {
  return request({
    url: '/doorinner/update',
    method: 'post',
    params: { data }
  })
}

export function deleteDoorInner(id) {
  return request({
    url: '/doorinner/delete',
    method: 'post',
    params: { id }
  })
}

export function addDoorInner(data) {
  return request({
    url: '/doorinner/add',
    method: 'post',
    params: { data } // 返回新增的id
  })
}

// DooorStyleScheme
export function getDoorStyleScheme(search, query) {
  const param = { search }
  if (query) {
    for (const key in query) {
      param[key] = query[key]
    }
  }

  return request({
    url: '/dsscheme/list',
    method: 'get',
    params: param
  }).then((data) => {
    return data.data
  })
}

export function addDoorStyleScheme(data) {
  return request({
    url: '/dsscheme/add',
    method: 'post',
    params: { data } // 返回新增的id
  })
}

export function updateDoorStyleScheme(data) {
  return request({
    url: '/dsscheme/update',
    method: 'post',
    params: { data }
  })
}

export function delDoorStyleScheme(id) {
  return request({
    url: '/dsscheme/delete',
    method: 'post',
    params: { id }
  })
}
