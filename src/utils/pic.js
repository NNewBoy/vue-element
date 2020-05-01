let host = 'https://wsai.oss-cn-shenzhen.aliyuncs.com/ws-kitsys/WardrobeSun/release/'

export function setPicPath(path) {
  host = path
}

/**
 * 检查图片是否能上传
 * @param {string} url
 * @returns {string}
 */
export function getPicUrl(url) {
  if (url === null || url === undefined || url === '') {
    return ''
  }
  url.replace('\\', '/')
  const str = host + url
  return str
}

/**
 * 检查图片是否能上传
 * @param {string} file
 * @returns {boolean}
 */
export function checkPicBeforeUpload(file) {
  const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    this.$message.error('上传头像图片只能是 JPG 格式!')
  }
  if (!isLt2M) {
    this.$message.error('上传头像图片大小不能超过 2MB!')
  }
  return isJPG && isLt2M
}
