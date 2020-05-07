import request from '@/utils/request'

export function getProductDir(pathName) {
  return request({
    url: '/product/productdir',
    method: 'get',
    params: { pathName: pathName }
  })
}
export function getProductInfo(modelno) {
  return request({
    url: '/product/info',
    method: 'get',
    params: { modelno: modelno }
  })
}
export function getDirOptions() {
  return request({
    url: '/product/dirOptions',
    method: 'get'
  })
}
export function searchProduct(filterText) {
  return request({
    url: '/product/searchproduct',
    method: 'get',
    params: { filterText: filterText }
  })
}
export function deleteProduct(modelno) {
  return request({
    url: '/product/delete',
    method: 'post',
    params: { modelno: modelno }
  })
}

// 约束
export function getContrainList() {
  return request({
    url: '/product/constrain/list',
    method: 'get'
  })
}

export function deleteConstrain(id) {
  return request({
    url: '/product/constrain/delete',
    method: 'post',
    params: { id }
  })
}

export function updateConstrain(data) {
  return request({
    url: '/product/constrain/update',
    method: 'post',
    params: { data }
  })
}

export function addConstrain(data) {
  return request({
    url: '/product/constrain/add',
    method: 'post',
    params: { data }
  })
}
