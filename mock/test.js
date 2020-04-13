import Mock from 'mockjs'

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    timestamp: +Mock.Random.date('T'),
    author: '@first',
    title: '@title(5, 10)',
    forecast: '@float(0, 100, 2, 2)',
    importance: '@integer(1, 3)',
    'type|1': ['CN', 'US', 'JP', 'EU'],
    'status|1': ['published', 'draft'],
    display_time: '@datetime',
    pageviews: '@integer(300, 5000)'
  }))
}
export default [
  {
    url: '/vue-element-admin/test/first',
    type: 'get',
    response: config => {
      const { data } = config.query
      if (data === '1') {
        return {
          code: 20000,
          data: {
            data: List
          }
        }
      } else {
        return {
          code: 401,
          data: '请求错误'
        }
      }
    }
  }
]
