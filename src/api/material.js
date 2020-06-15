import request from '@/utils/request'

export function getCatalog() {
  return request({
    url: '/mat/catalog',
    method: 'get'
  })
}

export function getCatalogByObjName(brand, objname) {
  return request({
    url: '/mat/catalog/objname',
    method: 'get',
    params: { brand, objname }
  })
}

export function getCatalogByProductPros(brand, pros) {
  return request({
    url: '/mat/catalog/productprops',
    method: 'get',
    params: { brand, pros }
  })
}

export function getCatalogByLineType(brand, linetype, linestyle) {
  return request({
    url: '/mat/catalog/linetype',
    method: 'get',
    params: { brand, linetype, linestyle }
  })
}

export function getCatalogByDoorInner(brand, id, all = false) {
  return request({
    url: '/mat/catalog/doorinner',
    method: 'get',
    params: { brand, id, all }
  })
}

export function getMat(use, text, query) {
  const param = { use: use, text: text }
  if (query) {
    for (const key in query) {
      param[key] = query[key]
    }
  }
  return request({
    url: '/mat/list',
    method: 'get',
    params: param
  })
}
export function getMatByConstraints(dir1, dir2, constrainttype, constraints) {
  return request({
    url: '/mat/list2',
    // url: '/mat/listbyconstraints',
    method: 'get',
    params: { dir1, dir2, constrainttype, constraints }
  })
}

export function getMatByDoorInner(brand, id, use, text, all = false) {
  return request({
    url: '/mat/list/doorinner',
    method: 'get',
    params: { brand, id, use, text, all }
  })
}

export function updateMat(data) {
  return request({
    url: '/mat/update',
    method: 'post',
    params: { data }
  })
}

export function addMat(data) {
  // return request({
  //   url: '/mat/add',
  //   method: 'post',
  //   params: { data } // 返回新增的id
  // })
  return Promise.resolve(111)
  // return Promise.reject()
}

export function importMat(data) {
  return request({
    url: '/mat/import',
    method: 'post',
    data: { data } // ,
    // transformRequest: [function(data) {
    //   return data
    // }]
  })
}

export function deleteMat(id) {
  return request({
    url: '/mat/delete',
    method: 'post',
    params: { id }
  })
}

export function getSetCtrl() {
  return request({
    url: '/mat/setctrl/list',
    method: 'get'
  })
}

export function enableSetCtrl(name, enable) {
  return request({
    url: '/mat/setctrl/enable',
    method: 'post',
    params: { obj: name, enable: enable }
  })
}

export function deleteSetCtrl(name) {
  return request({
    url: '/mat/setctrl/delete',
    method: 'post',
    params: { obj: name }
  })
}

export function addSetCtrl(obj, mainObj) {
  return request({
    url: '/mat/setctrl/add',
    method: 'post',
    params: { obj: obj, main_obj: mainObj }
  })
}

export function editSetCtrl(obj, mainObj) {
  return request({
    url: '/mat/setctrl/edit',
    method: 'post',
    params: { obj: obj, main_obj: mainObj }
  })
}

export function getSelMatGroup() {
  return request({
    url: '/mat/selmatgroup/list',
    method: 'get'
  })
}

export function deleteSelMatGroup(id) {
  return request({
    url: '/mat/selmatgroup/delete',
    method: 'post',
    params: { id }
  })
}

export function updateSelMatGroup(data) {
  return request({
    url: '/mat/selmatgroup/update',
    method: 'post',
    params: { data }
  })
}

export function addSelMatGroup(data) {
  return request({
    url: '/mat/selmatgroup/add',
    method: 'post',
    params: { data }
  })
}

// 扩展材料
export function getExtraSet() {
  return request({
    url: '/mat/extraset/list',
    method: 'get'
  })
}

export function deleteExtraSet(id) {
  return request({
    url: '/mat/extraset/delete',
    method: 'post',
    params: { id }
  })
}

export function editExtraSet(data) {
  return request({
    url: '/mat/extraset/update',
    method: 'post',
    params: { data }
  })
}

export function addExtraSet(data) {
  return request({
    url: '/mat/extraset/add',
    method: 'post',
    params: { data }
  })
}
