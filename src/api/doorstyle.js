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
  })
}

