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
    params: { token: getToken(), data }
  })
}

export function deleteDoorStyle(id) {
  return request({
    url: '/doorstyle/delete',
    method: 'post',
    params: { token: getToken(), id }
  })
}

export function addDoorStyle(data) {
  return request({
    url: '/doorstyle/add',
    method: 'post',
    params: { token: getToken(), data } // 返回新增的id
  })
}
