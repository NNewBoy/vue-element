import Mock from 'mockjs'

const strings = 'abcdefghijklmnopqrstuvwxyz' + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + '0123456789'
const captcha = []
for (let i = 0; i < 30; i++) {
  const text = Mock.Random.string(strings, 4)
  captcha.push(Mock.mock({
    text: text,
    url: Mock.Random.image('117x42', '#fff', text)
  }))
}
let index = 0

export default [
  {
    url: '/vue-element-admin/login/captcha',
    type: 'get',
    response: config => {
      index = Math.floor(Math.random() * 30)

      return {
        code: 20000,
        data: {
          url: captcha[index].url
        }
      }
    }
  },
  {
    url: '/vue-element-admin/login/checkCaptcha',
    type: 'get',
    response: config => {
      const { text } = config.query

      if (text.toLowerCase() === captcha[index].text.toLowerCase()) {
        return {
          code: 20000,
          data: true
        }
      } else {
        return {
          code: 20000,
          data: false
        }
      }
    }
  }
]
