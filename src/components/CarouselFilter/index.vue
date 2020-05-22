<template>
  <div>
    <div class="type-filter-name">{{ filterName }}</div>
    <div class="type-filter-container">
      <el-input
        v-model="searchText"
        class="filter-search"
        clearable
        size="small"
        placeholder="查找"
        prefix-icon="el-icon-search"
      />
    </div>
    <div align="left" class="scroll-body">
      <Carousel
        :data="filterData"
        v-bind="$attrs"
        v-on="$listeners"
      />
    </div>
  </div>
</template>

<script type="text/javascript">
/**
 * $attrs and $listener
 * @property {Number} height 每个选项的高度，单位为px，容器高度为height + 10，如果indicatorPosition为outside，容器高度为height + 30
 * @property {Number} perWidth 每个选项的宽度，单位为px
 * @property {Boolean} autoplay 是否自动切换
 * @property {String} indicatorPosition 指示器的位置，outside（选项外）/none（不现实）/''（选项内，默认）
 * @property {String} arrow 切换箭头的显示时机，always/hover/never
 * @property {Array} selected 指定选中的item
 * @function returnSelection 返回选中选项的text
 */
/**
 * @property {String} filterName 筛选器名称
 * @property {Array} carouselData 组件的数据，格式：[{text:'',src:''}]，text:文字，src:图片url
 */
import Carousel from '@/components/Carousel'
import toPinyin from '@/utils/chineseToPinyin'

export default {
  name: 'CarouselFilter',
  components: { Carousel },
  props: {
    filterName: {
      type: String,
      default: ''
    },
    carouselData: {
      require: true,
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      searchText: '',
      filterData: []
    }
  },
  watch: {
    carouselData: {
      immediate: true,
      deep: true,
      handler(val) {
        this.searchText = ''
        this.filterData = this.carouselData.filter(el => {
          const txt = el['text']
          const st = this.searchText.toUpperCase()
          return txt.toUpperCase().indexOf(st) >= 0 ||
          toPinyin.getFirstLetter(txt).indexOf(st) >= 0 ||
          toPinyin.chineseToPinYin(txt).toUpperCase().indexOf(st) >= 0
        })
      }
    },
    searchText: function(val) {
      this.filterData = this.carouselData.filter(el => {
        const txt = el['text']
        const st = this.searchText.toUpperCase()
        return txt.toUpperCase().indexOf(st) >= 0 ||
          toPinyin.getFirstLetter(txt).indexOf(st) >= 0 ||
          toPinyin.chineseToPinYin(txt).toUpperCase().indexOf(st) >= 0
      })
    }
  },
  mounted() {},
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.type-filter-container{
  position: relative;
  overflow: hidden;
  padding-left: 10px;
  padding-right: 10px;
  margin-left: 110px;
}
.type-filter-name{
  float: left;
  padding-left: 10px;
  padding-top: 16px;
  max-width: 110px;
}
.scroll-body{
  overflow:auto;
  margin: 6px 0;
  /* border-radius: 4px; */
  /* border: 1px solid #DDD; */
}
.filter-search{
  width: 200px;
  margin: 6px 0 10px 0;
}
</style>
