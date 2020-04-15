import request from '@/utils/request'

export function getImage() {
  return request({
    url: '/vue-element-admin/image/get',
    method: 'get'
  }).then(response => {
    return {
      url: response.data.url,
      urlCors: process.env.VUE_APP_CORS_API + response.data.urlCors
    }
  })
}

export function getCors() {
  return request({
    url: '/cors-api/cgyg/sp69unit/pic/hot.jpg?0.23373716510449327',
    method: 'get'
  }).then(response => {
    return response
  })
}
