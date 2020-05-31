<template>
  <div>
    <div
      v-for="(item,index) in menuList"
      :key="index"
    >
      <filterDiv
        v-show="menuShow[index]&&menuList[index].length>=showNumLen"
        :data="item"
        :level="index"
        :filter-name="filterNames[index]"
        :multi-choice="multiChoices[index]"
        :selected="selected[index]"
        @getType="getType"
      />
    </div>
  </div>
</template>

<script type="text/javascript">
/**
 * 与MultiFilter组件的区别在于，新添搜索历史记录功能，每次选择都会查询历史记录是否含有相同选择
 * @property {Array} datas 筛选器数据，格式:item = {name:xx, children:[ item ]}
 * @property {Number} showNumLen 多级筛选器不开启隐藏的选项最小长度，默认为1
 * @property {Array} filterNames 筛选器名称，长度与总级别相等
 * @property {Array} multiChoices 是否开启多选，长度与总级别相等，false不开启、true开启
 * @property {Array} selected 筛选器的默认选项，长度与总级别相等
 * @function getResult 获取选中选项，返回一个或多个选中选项的名字与索引的队列数组(对应单选和多选), 取消选择返回空数组
 */
import filterDiv from '@/components/TypeFilter'
export default {
  name: 'MemoryFilter',
  components: { filterDiv },
  props: {
    datas: {
      require: true,
      type: Array,
      default() {
        return []
      }
    },
    showNumLen: {
      type: Number,
      default: 1
    },
    filterNames: {
      type: Array,
      default() {
        return []
      }
    },
    multiChoices: {
      type: Array,
      default() {
        return []
      }
    },
    selected: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      inputData: [],
      menuList: [],
      parentMenuIndexList: [],
      parentMenuNameList: [],
      menuShow: [true],
      preSelection: {}, // 上一个选项
      shouldRecall: false // 下一次选择是否需要匹配
    }
  },
  computed: {
    levels() {
      return this.filterNames.length === 0 ? 1 : this.filterNames.length
    }
  },
  watch: {
    datas: {// 初始化数据
      immediate: true,
      handler(val) {
        if (this.levels < 1) {
          return
        }
        if (val.length > 0) {
          this.$nextTick(() => {
            this.inputData = val
            this.shouldRecall = false
            while (this.selected.length < this.filterNames.length) {
              this.selected.push('')
            }
            this.getKey(this.selected)
            const temp = []
            for (const i of val) {
              temp.push(i.name)
            }
            this.$set(this.menuList, 0, temp)
          })
        }
      }
    }
  },
  methods: {
    getKey(selected) { // 保存历史数据
      for (const i in selected) {
        if (selected[i]) {
          const key = JSON.stringify(selected.slice(0, parseInt(i) + 1))
          this.preSelection[key] = JSON.parse(JSON.stringify(selected))
        }
      }
    },
    getChildren(level, index) { // 获取对应元素的子元素
      const selectList = [index] // index为在所有选项中的索引
      const realList = []
      for (let i = level; i > 0; i--) {
        const parent = this.parentMenuNameList[i][selectList[0]]
        const firstIndex = this.parentMenuNameList[i].indexOf(parent)
        const realIndex = selectList[0] - firstIndex // 获取元素在所在队列的索引
        realList.unshift(realIndex)
        selectList.unshift(this.parentMenuIndexList[i][selectList[0]])
      }
      realList.unshift(selectList[0])
      let res = this.inputData
      for (let i = 0; i < realList.length; i++) {
        if (res[realList[i]].children) {
          res = res[realList[i]].children
        }
      }
      return res
    },
    getSelectedType(arr, level) { // 获取选中选项的队列,item为选项的名称,level为当前筛选器级别
      const res = [] // 所有选项对应的选项队列，单选或多选
      for (const item of arr) { // 遍历最后一级选择器选中的选项
        const selectedType = [item.index] // 选项在当前级别可选项数组的索引
        const realList = [] // 选项对应目录数据数组的索引
        for (let i = level; i > 0; i--) {
          const parent = this.parentMenuNameList[i][selectedType[0]] // 当前选项的父选项名称
          const firstIndex = this.parentMenuNameList[i].indexOf(parent) // 当前选项的父选项在父选项数组的下标，parentMenuNameList为当前级别所有选项的父选项
          const realIndex = selectedType[0] - firstIndex // 获取当前选项在对应的选项队列下当前级别的索引，为了解决多项选择时会有多个不同队列父元素的问题，如当前级别选择两项A,B，A的子选项有三个，B的子选项有三个，则父选项数组为AAABBB
          realList.unshift(realIndex)
          selectedType.unshift(this.parentMenuIndexList[i][selectedType[0]]) // 向selectedType头部加入当前级别父选项在目录数据数组的索引
        }
        realList.unshift(selectedType[0]) // 加入第一级选项在目录数据数组的索引
        let node = this.inputData
        const names = [] // 当前选项的在队列中的名称
        for (const i of realList) {
          names.push({ name: node[i].name, index: i })
          if (node[i].children) {
            node = node[i].children
          }
        }
        res.push(names)
      }
      return res
    },
    getType(arr, level) {
      if (arr.length > 0) {
        if (level < this.levels - 1) {
          if (this.shouldRecall) { // 当前不是在最高级别筛选器中选择时，匹配历史选择
            const matchStr = JSON.stringify(this.getSelectedType(arr, level)[0].map(val => val.name))
            const tempSelected = this.preSelection[matchStr]
            this.shouldRecall = false
            if (tempSelected) {
              this.selected.map((item, index) => {
                this.$set(this.selected, index, tempSelected[index])
              })
              const temp = this.datas.map(val => val.name)
              this.$set(this.menuList, 0, temp) // 重新选择
              return
            }
          }

          const nextMenu = [] // 下一级所有选项
          const theParentIndex = [] // 下一级所有选项的父选项的索引
          const theParentName = [] // 下一级所有选项的父选项的名称
          arr.map(val => {
            const temp = this.getChildren(level, val.index)
            for (const i of temp) {
              nextMenu.push(i.name)
              theParentIndex.push(val.index)
              theParentName.push(val.name)
            }
          })
          this.$set(this.menuShow, level + 1, true)
          this.$set(this.menuList, level + 1, nextMenu)
          this.$set(this.parentMenuIndexList, level + 1, theParentIndex)
          this.$set(this.parentMenuNameList, level + 1, theParentName)
        } else if (level === this.levels - 1) {
          const resArr = this.getSelectedType(arr, level)

          for (const o of resArr) {
            const listTemp = o.map(val => val.name)
            this.getKey(listTemp)
          }
          this.$emit('getResult', resArr)
          this.shouldRecall = true // 下一次选择需要匹配
        }
      } else { // 取消选择 隐藏下级选项
        this.menuShow.map((element, index) => {
          if (index > level) {
            this.$set(this.menuShow, index, false)
          }
        })
        this.$emit('getResult', []) // 返回空数组
        this.shouldRecall = true // 下一次选择需要匹配
      }
    }
  }
}
</script>
