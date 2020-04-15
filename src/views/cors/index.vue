<template>
  <div>
    <div class="img">
      <img src="https://tx-wsai-cdn.yfway.com/cgyg/sp69unit/pic/hot.jpg?0.23373716510449327">
      <!-- 页面头部添加referrer,隐藏发送请求时请求头表示来源的referrer字段 -->
      <!-- 成功 -->
      <img :src="url">
      <!-- 成功 -->
      <img referrerpolicy="no-referrer" :src="url">
      <!-- 失败 -->
      <img crossOrigin="anonymous" :src="url">
    </div>
    <div class="img">
      <img crossOrigin="anonymous" :src="urlCors">
      <img crossOrigin="anonymous" :src="url2">
    </div>
  </div>
</template>

<script type="text/javascript">
import { getImage } from '@/api/image'
export default {
  name: 'Cors',
  components: {},
  data() {
    return {
      url: '',
      urlCors: '',
      url2: ''
    }
  },
  computed: {},
  mounted() {
    getImage().then(response => {
      console.log(response)
      // 普通img标签请求
      this.url = response.url
      // 跨域代理
      this.urlCors = response.urlCors
      // 使用https://images.weserv.nl/?url=跳转
      this.url2 = 'https://images.weserv.nl/?url=' + response.url
    })
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
  .img{
    display: flex;
    justify-content: center;
    align-items: center;

    img{
      margin-right: 50px;
    }
  }
</style>

