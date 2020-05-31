const res1 = { 'success': true, 'data': [{ 'label': '69.大师柜', 'modelno': '69.大师柜' }, { 'label': '共用功能件', 'modelno': '共用功能件' }, { 'label': '01.趟门框架', 'modelno': '01.趟门框架' }, { 'label': '02.板式衣柜', 'modelno': '02.板式衣柜' }] }

const res2 = { 'success': true, 'data': [{ 'label': '共用功能件', 'modelno': '共用功能件' }, { 'label': '鞋柜', 'modelno': '鞋柜' }] }

const res3 = { 'success': true, 'data': [{ 'label': '地柜', 'modelno': '地柜' }] }

const res4 = { 'success': true, 'data': [{ 'label': '地柜', 'modelno': '地柜' }] }

const res5 = { 'success': true, 'data': [{ 'label': 'EKX2-C001DDB', 'modelno': 'EKX2-C001DDB', 'leaf': true }, { 'label': 'EKX2-C001DEB', 'modelno': 'EKX2-C001DEB', 'leaf': true }, { 'label': 'EKX2-C001LDB', 'modelno': 'EKX2-C001LDB', 'leaf': true }, { 'label': 'EKX2-C001LEB', 'modelno': 'EKX2-C001LEB', 'leaf': true }, { 'label': 'EKX2-C002DDB', 'modelno': 'EKX2-C002DDB', 'leaf': true }, { 'label': 'EKX2-C002DEB', 'modelno': 'EKX2-C002DEB', 'leaf': true }, { 'label': 'EKX2-C002LDB', 'modelno': 'EKX2-C002LDB', 'leaf': true }, { 'label': 'EKX2-C002LEB', 'modelno': 'EKX2-C002LEB', 'leaf': true }, { 'label': 'EKX4-B001DJB', 'modelno': 'EKX4-B001DJB', 'leaf': true }, { 'label': 'EKX4-B001DKB', 'modelno': 'EKX4-B001DKB', 'leaf': true }, { 'label': 'EKX4-B001DLB', 'modelno': 'EKX4-B001DLB', 'leaf': true }, { 'label': 'EKX4-B001LJB', 'modelno': 'EKX4-B001LJB', 'leaf': true }, { 'label': 'EKX4-B001LKB', 'modelno': 'EKX4-B001LKB', 'leaf': true }, { 'label': 'EKX4-B001LLB', 'modelno': 'EKX4-B001LLB', 'leaf': true }, { 'label': 'EKX4-B002DJB', 'modelno': 'EKX4-B002DJB', 'leaf': true }, { 'label': 'EKX4-B002DKB', 'modelno': 'EKX4-B002DKB', 'leaf': true }, { 'label': 'EKX4-B002DLB', 'modelno': 'EKX4-B002DLB', 'leaf': true }, { 'label': 'EKX4-B002LJB', 'modelno': 'EKX4-B002LJB', 'leaf': true }, { 'label': 'EKX4-B002LKB', 'modelno': 'EKX4-B002LKB', 'leaf': true }, { 'label': 'EKX4-B002LLB', 'modelno': 'EKX4-B002LLB', 'leaf': true }] }

const res6 = { 'success': true, 'data': [{ 'label': 'null', 'modelno': 'null' }] }

export default [
  {
    url: '/product/productdir',
    type: 'get',
    response: config => {
      const { pathName } = config.query

      let res = {}

      if (!pathName) {
        res = res1
      } else if (pathName === '69.大师柜') {
        res = res2
      } else if (pathName === '69.大师柜/鞋柜') {
        res = res3
      } else if (pathName === '69.大师柜/鞋柜/地柜') {
        res = res4
      } else if (pathName === '69.大师柜/鞋柜/地柜/地柜') {
        res = res5
      }
      return {
        code: 20000,
        data: res.data
      }
    }
  }
]
