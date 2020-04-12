import request from '@/utils/request'

export function getCaptcha() {
  return request({
    url: '/vue-element-admin/login/captcha',
    method: 'get'
  })
}
export function checkCaptcha(text) {
  return request({
    url: '/vue-element-admin/login/checkCaptcha',
    method: 'get',
    params: { text }
  })
}
