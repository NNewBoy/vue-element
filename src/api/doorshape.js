import request from '@/utils/request'

export function getList(query) {
  const param = { }
  for (const key in query) {
    param[key] = query[key]
  }
  return request({
    url: '/pdoor/list',
    method: 'get',
    params: param
  })
}

export function setLock(code, lock) {
  return request({
    url: '/pdoor/lock',
    method: 'post',
    params: { code: code, lock: lock }
  })
}

export function del(code) {
  return request({
    url: '/pdoor/delete',
    method: 'post',
    params: { code: code }
  })
}

export function update(data) {
  return request({
    url: '/pdoor/update',
    method: 'post',
    params: { data: JSON.stringify(Array(data)) }
  })
}
