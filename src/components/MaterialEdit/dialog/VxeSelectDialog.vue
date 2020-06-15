<template>
  <vxe-modal v-model="visible" esc-closable resize width="60vw" min-height="50vh" :title="title">
    <div class="type-filter-container">
      <div class="select-menu">
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
            clearable
            placeholder="查找"
            prefix-icon="el-icon-search"
          />
        </div>
      </div>
      <div ref="selectContent" class="select-content">
        <div ref="selectContentRef" class="select-content-div">
          <a
            v-for="(item, index) in tableData"
            :id="'item'+index"
            :key="'t-'+index"
            href="javascript:;"
            class="type-item"
            :style="menuList[selectedLetter].children[index]&&!searchType[index]?'':'display:none'"
            :class="selectedType[index]?'active':''"
            @click="onClick2(index)"
          >
            {{ item.name }}
          </a>
        </div>
      </div>
    </div>
  </vxe-modal>
</template>

<script type="text/javascript">
/**
 * @property {String} title 对话框标题
 * @property {Boolean} dialogVisible 对话框显示与否
 * @property {Array} tableData 当前表单的数据数组，[{name,key}]，name为名称，key为选项索引
 * @function closeCatalogDialog 通知父组件关闭对话框
 * @function getSelected 返回选中选项{name,key}
 */
import toPinyin from '@/utils/chineseToPinyin'
export default {
  name: 'VxeSelectDialog',
  props: {
    title: {
      require: false,
      type: String,
      default: ''
    },
    dialogVisible: {
      require: true,
      type: Boolean,
      default: false
    },
    tableData: {
      require: true,
      type: Array,
      default() {
        return []
      }
    },
    selected: {
      require: false,
      type: String,
      default: ''
    }
  },
  data() {
    return {
      corr: { '全部': 0, 'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8, 'i': 9, 'j': 10, 'k': 11, 'l': 12, 'm': 13, 'n': 14, 'o': 15, 'p': 16, 'q': 17, 'r': 18, 's': 19, 't': 20, 'u': 21, 'v': 22, 'w': 23, 'x': 24, 'y': 25, 'z': 26, '其他': 27 },
      selectedLetter: 0,
      selectedType: [],
      searchType: [],
      searchText: '',
      pinyin: [],
      visible: false
    }
  },
  computed: {
    menuList() {
      const list = [
        { type: '全部', children: [] }, { type: 'A', children: [] }, { type: 'B', children: [] },
        { type: 'C', children: [] }, { type: 'D', children: [] }, { type: 'E', children: [] },
        { type: 'F', children: [] }, { type: 'G', children: [] }, { type: 'H', children: [] },
        { type: 'I', children: [] }, { type: 'J', children: [] }, { type: 'K', children: [] },
        { type: 'L', children: [] }, { type: 'M', children: [] }, { type: 'N', children: [] },
        { type: 'O', children: [] }, { type: 'P', children: [] }, { type: 'Q', children: [] },
        { type: 'R', children: [] }, { type: 'S', children: [] }, { type: 'T', children: [] },
        { type: 'U', children: [] }, { type: 'V', children: [] }, { type: 'W', children: [] },
        { type: 'X', children: [] }, { type: 'Y', children: [] }, { type: 'Z', children: [] },
        { type: '其他', children: [] }
      ]
      const reg = new RegExp('[a-z]')
      for (const item in this.tableData) {
        list[0].children.push(true)
        let firstLetter
        if (this.tableData[item].name) {
          firstLetter = toPinyin.chineseToPinYin(this.tableData[item].name).charAt(0).toLowerCase()
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
    }
  },
  watch: {
    dialogVisible: {
      immediate: true,
      deep: true,
      handler(val) {
        this.visible = val
        if (val) {
          this.selectedLetter = 0
          this.selectedType = []
          this.searchType = []
          this.searchText = ''
          if (this.tableData.length > 0) {
            const selectedIndex = this.tableData.findIndex(el => el.name === this.selected)
            if (this.tableData.length - 1 < selectedIndex || selectedIndex === -1) {
              this.$set(this.selectedType, 0, true)
            } else {
              this.$set(this.selectedType, selectedIndex, true)
            }
            this.$nextTick(() => {
              this.$refs.selectContent.scrollTop = 0
              for (const i in this.selectedType) {
                if (this.selectedType[i]) {
                  const div = this.$refs.selectContentRef.querySelector('#item' + i)
                  this.$refs.selectContent.scrollTop = div.offsetTop - div.clientHeight - 12
                  break
                }
              }
              if (this.tableData.length > 0) {
                for (const item in this.tableData) {
                  if (this.tableData[item].name) {
                    const spell = toPinyin.chineseToPinYin(this.tableData[item].name)
                    const UCspell = spell.toLowerCase()
                    const firstLetter = toPinyin.getFirstLetter(this.tableData[item].name)
                    const UCfirstLetter = toPinyin.getFirstLetter(this.tableData[item].name).toLowerCase()
                    this.pinyin[item] = firstLetter + '-' + spell + UCfirstLetter + '-' + UCspell
                  } else {
                    this.pinyin[item] = ''
                  }
                }
              }
            })
          }
        }
      }
    },
    visible(val) {
      if (!val) {
        this.setVisible()
      }
    },
    searchText(val) {
      this.searchType = []
      this.selectedLetter = 0
      if (val !== '') {
        this.tableData.map((item, index) => {
          if (item.name.indexOf(val) === -1) { // 隐藏字符不符合
            this.$set(this.searchType, index, true)
          }
          if (this.pinyin[index].indexOf(val) !== -1) { // 显示拼音和缩写符合
            this.$set(this.searchType, index, false)
          }
        })
      }
    }
  },
  methods: {
    onClick1(index) {
      this.selectedLetter = index
    },
    onClick2(index) {
      if (this.selectedType[index]) {
        this.$set(this.selectedType, index, false)
        return
      }
      this.selectedType.map((item, index1) => {
        this.$set(this.selectedType, index1, false)
      })
      this.$set(this.selectedType, index, true)
      this.getType()
    },
    getType() {
      const res = this.selectedType.map((item, index) => {
        if (item) {
          return this.tableData[index]
        }
      })
      this.clickCancel()
      this.$emit('getSelected', res.filter(item => item !== undefined)[0])
    },
    setVisible() {
      this.$emit('closeSelectDialog')
    },
    clickCancel() {
      this.visible = false
      this.setVisible()
    }
  }
}
</script>

<style lang="scss" scoped>
.type-filter-container{
  position: relative;
  overflow: hidden;
  max-height: 50vh;
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
  max-height: 40vh;
  border-radius: 4px;
  border: 1px solid #DDD;
  color: #005aa0;

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
.search-type{
  position: relative;
  display: inline-block;
  width:130px;
  margin-left: 15px;
}
</style>
