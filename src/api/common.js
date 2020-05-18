import request from '@/utils/request'
import * as pako from 'pako'
import qs from 'qs'

export function importData(url, data) {
  return request({
    url: url,
    method: 'post',
    data: { data },
    transformRequest: [function(data) {
      data.data = btoa(pako.gzip(JSON.stringify(data.data), { to: 'string' }))
      return qs.stringify(data)
    }],
    timeout: 120000 // 2min
  })
}
