import request from '@/utils/request'

export function getFirst(data) {
  return request({
    url: '/vue-element-admin/test/first',
    method: 'get',
    params: { data }
  })
}
