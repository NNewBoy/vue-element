import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export function getList(query) {
  // const param = { token: getToken() }
  // for (const key in query) {
  //   param[key] = query[key]
  // }
  return request({
    url: '/pdoor/list',
    method: 'get',
    params: query
  }).then((data) => {
    return data.data
  })
}

export function setLock(code, lock) {
  return request({
    url: '/pdoor/lock',
    method: 'post',
    params: { token: getToken(), code: code, lock: lock }
  })
}

export function del(code) {
  return request({
    url: '/pdoor/delete',
    method: 'post',
    params: { token: getToken(), code: code }
  })
}

export function update(data) {
  return request({
    url: '/pdoor/update',
    method: 'post',
    params: { token: getToken(), data: JSON.stringify(Array(data)) }
  })
}
