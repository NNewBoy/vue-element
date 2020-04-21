<template>
  <div class="type-filter-body" :class="canSelectMore?'show-multi-border':'show-radio-border'">
    <div class="type-filter-name">{{ filterName }}</div>
    <div class="type-filter-container">
      <div v-if="!showMore&&data.length>0" class="select-menu">
        <div
          v-for="(item,index) in menuList"
          :key="'s-'+index"
          class="select-item"
          :style="item.children.length!==0?'':'display:none'"
          :class="selectedLetter===index?'active':''"
          @click="onClick1(index)"
          @mouseover="onClick1(index)"
        >
          {{ item.type }}
        </div>
        <div class="search-type">
          <el-input
            v-model="searchText"
            size="mini"
            placeholder="查找"
            prefix-icon="el-icon-search"
          />
        </div>
      </div>
      <div ref="selectContent" class="select-content" :class="showMore?'mini-content':''">
        <div ref="selectContentRef" class="select-content-div">
          <a
            v-for="(item, index) in data"
            :key="'t-'+index"
            href="javascript:;"
            class="type-item"
            :style="menuList[selectedLetter].children[index]&&!searchType[index]?'':'display:none'"
            :class="selectedType[index]?'active':''"
            @click="onClick2(index)"
          >
            {{ item }}
          </a>
        </div>
      </div>
      <div v-show="showCondition && initCondition" class="selected-condition">
        <span>已选条件:</span>
        <a
          v-for="(item, index) in selectedType"
          :key="'h-'+index"
          href="javascript:;"
          :style="item?'':'display:none'"
          @click="onClick2(index)"
        >
          <i class="el-icon-check" />{{ data[index] }}
        </a>
      </div>
      <div class="selected-control">
        <div v-show="initCondition" class="more-control">
          <a
            v-if="showMore"
            href="javascript:;"
            class="more-btn"
            @click="moreFunc"
          >
            更多
            <i class="el-icon-arrow-down" />
          </a>
          <a
            v-else
            href="javascript:;"
            class="more-btn"
            @click="moreFunc"
          >
            收起
            <i class="el-icon-arrow-up" />
          </a>
        </div>
        <a
          v-show="multiChoice"
          href="javascript:;"
          class="multi-control"
          :class="canSelectMore?'active':''"
          @click="setMulti"
        >
          多选
          <i class="el-icon-plus" />
        </a>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
/**
 * @property {Array} data 筛选器数据
 * @property {Number} level 多级筛选器的级别，从0开始
 * @property {String} filterName 筛选器名称
 * @property {Boolean} multiChoice 是否开启多选
 * @function getType 获取选中选项，返回包含选中选项的编号和名字的对象数组, 取消选择返回空数组
 */
import toPinyin from './utils/chineseToPinyin'
export default {
  components: {},
  props: {
    data: {
      require: true,
      type: Array,
      default() {
        return []
      }
    },
    level: {
      require: true,
      type: Number,
      default: 0
    },
    filterName: {
      type: String,
      default: ''
    },
    multiChoice: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      corr: { '全部': 0, 'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8, 'i': 9, 'j': 10, 'k': 11, 'l': 12, 'm': 13, 'n': 14, 'o': 15, 'p': 16, 'q': 17, 'r': 18, 's': 19, 't': 20, 'u': 21, 'v': 22, 'w': 23, 'x': 24, 'y': 25, 'z': 26, '其他': 27 },
      selectedLetter: 0,
      selectedType: [true],
      showMore: true,
      canSelectMore: false,
      initCondition: false,
      searchType: [],
      searchText: ''
    }
  },
  computed: {
    menuList() {
      const list = [
        { type: '全部', children: [] },
        { type: 'A', children: [] },
        { type: 'B', children: [] },
        { type: 'C', children: [] },
        { type: 'D', children: [] },
        { type: 'E', children: [] },
        { type: 'F', children: [] },
        { type: 'G', children: [] },
        { type: 'H', children: [] },
        { type: 'I', children: [] },
        { type: 'J', children: [] },
        { type: 'K', children: [] },
        { type: 'L', children: [] },
        { type: 'M', children: [] },
        { type: 'N', children: [] },
        { type: 'O', children: [] },
        { type: 'P', children: [] },
        { type: 'Q', children: [] },
        { type: 'R', children: [] },
        { type: 'S', children: [] },
        { type: 'T', children: [] },
        { type: 'U', children: [] },
        { type: 'V', children: [] },
        { type: 'W', children: [] },
        { type: 'X', children: [] },
        { type: 'Y', children: [] },
        { type: 'Z', children: [] },
        { type: '其他', children: [] }
      ]
      const reg = new RegExp('[a-z]')
      for (const item in this.data) {
        list[0].children.push(true)
        let firstLetter
        if (this.data[item]) {
          firstLetter = toPinyin.chineseToPinYin(this.data[item]).charAt(0).toLowerCase()
        } else {
          firstLetter = ''
        }
        if (reg.test(firstLetter)) {
          list[this.corr[firstLetter]].children[item] = true
        } else {
          list[27].children[item] = true
        }
      }
      return list
    },
    showCondition() {
      for (const item of this.selectedType) {
        if (item === true) {
          return true
        }
      }
      return false
    }
  },
  watch: {
    data: {// 初始化数据
      immediate: true,
      handler(val) {
        this.selectedLetter = 0
        this.showMore = true
        this.canSelectMore = false
        this.initCondition = false
        this.selectedType = [true]
        this.$nextTick(() => {
          if (this.$refs.selectContentRef.offsetHeight > 130) {
            this.initCondition = true
          }
          if (this.data.length > 0) { // 初始化默认选第一项
            this.getType()
          }
        })
      }
    },
    searchText(val) {
      this.searchType = []
      this.selectedLetter = 0
      if (val !== '') {
        this.data.map((item, index) => {
          if (item.indexOf(val) === -1) {
            this.$set(this.searchType, index, true)
          }
        })
      }
      // this.$nextTick(() => { // 隐藏选中条件显示框
      //   if (this.$refs.selectContentRef.offsetHeight > 130) {
      //     this.initCondition = true
      //   } else {
      //     this.initCondition = false
      //   }
      // })
    }
  },
  methods: {
    onClick1(index) {
      this.selectedLetter = index
    },
    onClick2(index) {
      if (!this.canSelectMore) {
        if (this.selectedType[index]) {
          this.$set(this.selectedType, index, false)
          this.getType()
          return
        }
        this.selectedType.map((item, index1) => {
          this.$set(this.selectedType, index1, false)
        })
        this.$set(this.selectedType, index, true)
      } else {
        if (this.selectedType[index]) {
          this.$set(this.selectedType, index, false)
        } else {
          this.$set(this.selectedType, index, true)
        }
      }
      this.getType()
    },
    getType() {
      const res = this.selectedType.map((item, index) => {
        if (item) {
          return { name: this.data[index], index: index }
        }
      })
      this.$emit('getType', res.filter(item => item !== undefined), this.level)
    },
    moreFunc() {
      if (!this.canSelectMore) {
        this.showMore = !this.showMore
      }
      this.$refs.selectContent.scrollTop = 0
    },
    setMulti() {
      this.canSelectMore = !this.canSelectMore
      this.showMore = !this.canSelectMore
    }
  }
}
</script>

<style lang="scss" scoped>
.type-filter-body{
  border: 2px solid transparent;

  &.show-multi-border{
    border-color: #edd28b;
  }
  &.show-radio-border{
    border-bottom: 1px dashed #eee;
  }
}
.type-filter-container{
  position: relative;
  overflow: hidden;
  padding-left: 10px;
  padding-right: 160px;
  margin-left: 110px;
}
.type-filter-name{
  float: left;
  padding-left: 10px;
  padding-top: 16px;
  max-width: 110px;
}
.select-menu{
  padding-top: 6px;
  margin-bottom: 10px;
}
.select-item{
  display: inline-block;
  height: 20px;
  line-height: 20px;
  font-size: 14px;
  border: 1px solid #FFF;
  padding: 0 3px;
  cursor: default;
  text-align: center;
  color: #005aa0;
}
.select-item:hover{
  border-color: #e4393c;
  color: #e4393c;
}
.select-content{
  overflow-y: auto;
  overflow-x: hidden;
  margin: 6px 0;
  padding: 6px;
  min-height: 62px;
  max-height: 204px;
  border-radius: 4px;
  border: 1px solid #DDD;
  color: #005aa0;

  &.mini-content{
    overflow-y: hidden;
    max-height: 108px;
  }
  .select-content-div{
    padding: 0;
    margin: 0;
  }
}
.type-item{
  height: 38px;
  display: inline-block;
  padding: 10px;
  margin: 5px 10px 5px 0;
  border-radius: 4px;
  font-size: 14px;
  border: 1px solid #DDD;
  background: #FFF;
  text-align: center;
  cursor: pointer;
}
.type-item:hover{
  border-color: #e4393c;
  color: #e4393c;
}
.active{
  border-color: #e4393c!important;
  color: #e4393c!important;
}
.selected-control{
  position: absolute;
  right: 10px;
  top: 6px;
  width: 137px;
}
.more-control{
  display: inline-block;
}
.more-btn{
  float: left;
  border: 1px solid #46a6ff;
  padding: 2px;
  cursor: pointer;
  color: #46a6ff;

  &:hover{
    border-color: #e4393c;
    color: #e4393c;
  }
  i{
    text-align: center;
  }
}
.multi-control{
  float: right;
  border: 1px solid #46a6ff;
  padding: 2px;
  color: #46a6ff;

  &:hover{
    border-color: #e4393c;
    color: #e4393c;
  }
}
.selected-condition{
  font-size: 14px;
  line-height: 24px;
  padding-bottom: 6px;

  a{
    display: inline-block;
    margin: 0 5px;
  }
  i{
    border: 1px solid #e4393c;
    color: #e4393c;
  }
}
.search-type{
  display: inline-block;
  width:130px;
  margin-left: 15px;
}
</style>
