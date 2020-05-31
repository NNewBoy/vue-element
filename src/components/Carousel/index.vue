<template>
  <div ref="carouselContainer" class="carousel-container" :style="carouselContainerHeight">
    <el-carousel ref="myCarousel" :height="height+'px'" :autoplay="autoplay" :indicator-position="indicatorPosition" :arrow="arrow">
      <el-carousel-item v-for="(item,index) in listData" :key="index" class="carousel-item">
        <div
          v-for="(item1,index1) in item"
          :key="index1"
          class="item-pointer"
          :style="carouselItemStyle"
          :class="selectedItem===item1.text?'selected-item':'list-item'"
          @click="onSelected(item1.text)"
        >
          <el-image :src="item1.src" style="width: 100px; height: 100px; margin: 2px" />
          <span align="center">{{ item1.text }}</span>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script type="text/javascript">
/**
 * @property {Number} height 每个选项的高度，单位为px，容器高度为height + 10，如果indicatorPosition为outside，容器高度为height + 30
 * @property {Number} perWidth 每个选项的宽度，单位为px
 * @property {Boolean} autoplay 是否自动切换
 * @property {String} indicatorPosition 指示器的位置，outside（选项外）/none（不现实）/''（选项内，默认）
 * @property {String} arrow 切换箭头的显示时机，always/hover/never
 * @property {Array} data 组件的数据，格式：[{text:'',src:''}]，text:文字，src:图片url
 * @property {Array} selected 指定选中的item
 * @function returnSelection 返回选中选项的text
 */
export default {
  name: 'Carousel',
  components: {},
  props: {
    height: {
      require: false,
      type: Number,
      default: 150
    },
    perWidth: {
      require: false,
      type: Number,
      default: 110
    },
    autoplay: {
      require: false,
      type: Boolean,
      default: true
    },
    indicatorPosition: {
      require: false,
      type: String,
      default: ''
    },
    arrow: {
      require: false,
      type: String,
      default: 'hover'
    },
    data: {
      require: true,
      type: Array,
      default() {
        return []
      }
    },
    selected: { // 当前选中的选项
      require: false,
      type: String,
      default: ''
    }
  },
  data() {
    return {
      listData: [],
      mySelected: '' // 当前选中的选项
    }
  },
  computed: {
    carouselItemStyle() {
      return `width:${this.perWidth}px;heigth:${this.height}px;display: inline-block;`
    },
    carouselContainerHeight() {
      let height = this.height + 10 // 避免覆盖选项的border
      if (this.indicatorPosition === 'outside') { // 如果将指示器的位置放到外面，容器会自动增高30
        height += 20
      }
      return `height:${height}px`
    },
    selectedItem() {
      return this.selected || this.mySelected // 如果父组件有指定，用父组件的，否则用自己的
    }
  },
  watch: {
    data: {
      immediate: true,
      deep: true,
      handler(val) { // 初始化
        if (val.length > 0) {
          this.mySelected = ''
          let targetIndex = 0 // 选项所在页
          this.$nextTick(() => {
            Promise.resolve().then(() => {
              if (val.length >= 1) {
                const constationWidth = this.$refs.carouselContainer.offsetWidth
                const amount = Math.floor((constationWidth - 120) / this.perWidth)
                this.listData = []
                val.forEach((item, index) => {
                  const page = Math.floor(index / amount) // 计算该元素为第几个数组内
                  if (!this.listData[page]) { // 判断是否存在
                    this.listData[page] = []
                  }
                  this.listData[page].push(item)
                  if (item.text === this.selected) {
                    targetIndex = page
                  }
                })
              }
            }).then(() => { // 跳转到选项所在页
              if (this.selected === '') {
                this.mySelected = val[0].text
              }
              this.$refs.myCarousel.setActiveItem(targetIndex)
              this.onSelected(this.selectedItem)
            })
          })
        }
      }

    }
  },
  mounted() {},
  methods: {
    onSelected(select) {
      this.mySelected = select
      this.$emit('returnSelection', select)
    }
  }
}
</script>

<style lang="scss" scoped>
.list-item {
  top: 0px;
  text-align: center;
  vertical-align: top;
  padding: 2px;
  position: relative;
}

.selected-item {
  top: 0px;
  text-align: center;
  vertical-align: top;
  padding: 2px;
  position: relative;
  border-radius: 4px;
  border: 1px solid;
  border-color: #e4393c;
  color: #e4393c;
}

.carousel-item{
  display: flex;
  justify-content: center;
}

.item-pointer{
  cursor: pointer;
}
</style>
