<template>
  <div align="center" :style="`width:${width}px;height:${height}px;`">
    <el-upload
      v-if="enableUpload"
      class="hotadv-uploader"
      :action="action"
      :data="uploadData"
      :show-file-list="false"
      :on-success="onUploadPicSuccess"
      :before-upload="beforePicUpload"
    >
      <el-image v-if="pic" :src="getPicUrl(pic)" :style="`width:${width}px;height:${height}px`" />
      <i v-else class="el-icon-plus hotadv-uploader-icon" />
    </el-upload>
    <el-image v-else :src="getPicUrl(pic)" :style="`width:${width}px;height:${height}px`" />
  </div>
</template>

<script>
/**
 * @property {Function} onSuccess 上传成功的回调函数
 * @property {String} action 上传url
 * @property {Number} id 标记id
 * @property {String} pic 图片路径
 * @property {Number} picSize 图片大小，单位M
 * @property {Number} width 图片宽度
 * @property {Number} height 图片高度
 * @property {Boolean} enableUpload 是否允许上传
 */

import { getThumbnailUrl, checkPicBeforeUpload } from '@/utils/pic'
import { getToken } from '@/utils/auth'

export default {
  name: 'UploadPic',
  props: {
    onSuccess: {
      require: false,
      type: Function,
      default: null
    },
    action: {
      require: true,
      type: String,
      default: ''
    },
    id: {
      require: true,
      type: Number,
      default: null
    },
    pic: {
      require: true,
      type: String,
      default: null
    },
    picSize: {
      require: false,
      type: Number,
      default: 2
    },
    width: {
      require: false,
      type: Number,
      default: 100
    },
    height: {
      require: false,
      type: Number,
      default: 100
    },
    enableUpload: {
      require: false,
      type: Boolean,
      default: true
    },
    data: {
      require: false,
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      token: getToken()
    }
  },
  computed: {
    uploadData() {
      const data = { 'token': this.token, 'id': this.id }
      if (this.data) {
        for (const key in this.data) {
          data[key] = this.data[key]
        }
      }
      // console.log(data)
      return data
    }
  },
  methods: {
    beforePicUpload(file) {
      return checkPicBeforeUpload(file, this.picSize)
    },
    onUploadPicSuccess(res, file) {
      const pic = this.pic // 刷新图片
      this.pic = null
      this.pic = pic
      this.onSuccess && this.onSuccess(res, file)
    },
    getPicUrl(pic) {
      // return pic ? (getThumbnailUrl(pic) + '?' + Math.random()) : ''
      return pic ? getThumbnailUrl(pic) : ''
    }
  }
}
</script>

<style scoped>

</style>
