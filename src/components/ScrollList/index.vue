<template>
  <div>
    <div v-if="topBtn" class="go-top">
      <el-button type="primary" icon="el-icon-caret-top" circle @click="goTop" />
    </div>
    <div v-if="leftBtn" class="go-left">
      <el-button type="primary" icon="el-icon-caret-left" circle @click="goLeft" />
    </div>
    <div v-if="rightBtn" class="go-right">
      <el-button type="primary" icon="el-icon-caret-right" circle @click="goRight" />
    </div>
    <div
      v-if="type === 'list'"
      ref="scrollList"
      class="scrollList-container"
    >
      <div class="scrollList-body">
        <slot />
      </div>
    </div>

    <div class="total-border">
      <el-tag class="total-tag">Total {{ total }}</el-tag>
    </div>
  </div>

</template>

<script type="text/javascript">
/**
 * @description 仅适用于element ui 的表格el-table
 * @description window不固定页头，控制浏览器滚动，不需要slot
 * @description list固定页头，控制列表滚动，将列表代码放入slot
 * @property {String} type 滑动列表类型 window | list
 * @property {Number} total 数据总数
 * @property {Number} amount 已刷新数据数
 * @property {Boolean} topBtn 是否显示回到顶部按钮
 * @property {Boolean} leftBtn 是否显示向左滚动按钮
 * @property {Boolean} rightBtn 是否显示向右滚动按钮
 * @property {String} listId 列表id，要使用左右按钮必须传入
 * @function refreshData 数据加载函数
 */
export default {
  name: 'ScrollList',
  props: {
    type: {
      required: true,
      type: String
    },
    total: {
      required: true,
      type: Number
    },
    amount: {
      required: true,
      type: Number
    },
    topBtn: {
      type: Boolean,
      default: true
    },
    leftBtn: {
      type: Boolean,
      default: false
    },
    rightBtn: {
      type: Boolean,
      default: false
    },
    listId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      nowScroll: 0,
      firstRefresh: true,
      oldScrollTop: 0,
      nowScrollTop: 0
    }
  },
  mounted() {
    if (this.type === 'window') {
      this.firstRefresh = true
      window.addEventListener('scroll', this.refreshData, true)
    } else if (this.type === 'list') {
      this.firstRefresh = true
      // const element = this.$refs.scrollList
      // const top = element.getBoundingClientRect().top
      // const clientHeight = this.getClientHeight()
      // this.$refs.scrollList.style.maxHeight = clientHeight - top - 70

      const element = document.querySelector('.el-table__body-wrapper')
      element.addEventListener('scroll', this.refreshData, true)
    }
  },
  beforeDestroy() {
    if (this.type === 'window') {
      window.removeEventListener('scroll', this.refreshData, true)
    } else if (this.type === 'list') {
      if (this.controlArea !== '') {
        const element = document.querySelector('.el-table__body-wrapper')
        element.removeEventListener('scroll', this.refreshData, true)
      }
    }
  },
  methods: {
    refleshData_fixed() {
      if (this.amount < this.total) {
        this.$emit('refreshData')
      }
    },
    goLeft() {
      if (this.listId !== '') {
        const elem = document.getElementById(this.listId).querySelector('.el-table__body-wrapper')
        elem.scrollLeft -= 50
      }
    },
    goRight() {
      if (this.listId !== '') {
        const elem = document.getElementById(this.listId).querySelector('.el-table__body-wrapper')
        elem.scrollLeft += 50
      }
    },
    goTop() {
      if (this.type === 'window') {
        this.goBodyTop(0)
      } else if (this.type === 'list') {
        this.goBodyTop(0)
      }
    },
    async refreshData() {
      let scrollTop = 0
      let scrollHeight = 0
      let clientHeight = 0
      if (this.type === 'window') {
        scrollTop = this.getScrollTop()
        scrollHeight = this.getScrollHeight()
        clientHeight = this.getClientHeight()
      } else if (this.type === 'list') {
        const element = document.querySelector('.el-table__body-wrapper')
        clientHeight = element.clientHeight
        scrollHeight = element.scrollHeight
        scrollTop = element.scrollTop
      }
      if (this.firstRefresh) { // 初始化时滚动到顶部
        this.goBodyTop(0)
        this.firstRefresh = false
      }
      const canScroll = scrollHeight - clientHeight
      if (scrollTop > (canScroll + this.oldScrollTop) / 2 && this.nowScroll === 0 && this.amount < this.total) {
        this.nowScroll = 0.5
        this.oldScrollTop = scrollTop
        await this.$emit('refreshData')
        this.goBodyTop(this.nowScrollTop)
        this.nowScroll = 0
      }
      this.nowScrollTop = scrollTop // 防止不断触底（谷歌）
    },
    getClientHeight() {
      return document.documentElement.clientHeight || document.body.parentNode.clientHeight || document.body.clientHeight
    },
    getScrollHeight() {
      return document.documentElement.scrollHeight || document.body.parentNode.scrollHeight || document.body.scrollHeight
    },
    getScrollTop() {
      return document.documentElement.scrollTop || document.body.parentNode.scrollTop || document.body.scrollTop
    },
    goBodyTop(scrollTop) {
      if (this.type === 'window') {
        document.documentElement.scrollTop = scrollTop
        document.body.parentNode.scrollTop = scrollTop
        document.body.scrollTop = scrollTop
      } else if (this.type === 'list') {
        // const element = this.$refs.scrollList
        const element = document.querySelector('.el-table__body-wrapper')
        element.scrollTop = scrollTop
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.go-top,.go-right,.go-left{
  z-index: 1000;
  position: fixed;
  bottom: 200px;
  right: 0;
  width: 48px;
  text-align: center;
}
.go-right{
  bottom: 100px;
}
.go-left{
  bottom: 150px;
}
.total-border{
  position: relative;
  text-align: center;
}
.total-tag{
  margin: 5px 50px;
}
.scrollList-container{
  overflow-x: auto;
  border-bottom:1px solid #dfe6ec;
  border-top:1px solid #dfe6ec;
}
.scrollList-body{
  overflow: auto;
  overflow-x: hidden;
  width: 100%;
}
</style>
