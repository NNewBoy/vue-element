import { pinyin } from './pinyin.js'
export default {
  getFirstLetter: function(l1) {

  },
  chineseToPinYin: function(l1) {
    var l2 = l1.length
    var I1 = ''
    var reg = new RegExp(/^[\u4e00-\u9fa5]+$/)
    for (var i = 0; i < l2; i++) {
      var val = l1.substr(i, 1)
      var name = this.arraySearch(val, pinyin)
      if (name !== false && reg.test(val)) {
        I1 += name
      } else {
        I1 += val
      }
    }
    I1 = I1.replace(/ /g, '-')
    while (I1.indexOf('--') > 0) {
      I1 = I1.replace('--', '-')
    }
    return I1
  },
  arraySearch: function(l1, l2) {
    for (var name in pinyin) {
      if (pinyin[name].indexOf(l1) !== -1) {
        return this.ucfirst(name)
      }
    }
    return false
  },
  ucfirst: function(l1) {
    if (l1.length > 0) {
      var first = l1.substr(0, 1).toUpperCase()
      var spare = l1.substr(1, l1.length)
      return first + spare
    }
  }
}
