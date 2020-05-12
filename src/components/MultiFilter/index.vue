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
 * @property {Array} datas 筛选器数据，格式:item = {name:xx, children:[ item ]}
 * @property {Number} showNumLen 多级筛选器不开启隐藏的选项最小长度，默认为1
 * @property {Array} filterNames 筛选器名称，长度与总级别相等
 * @property {Array} multiChoices 是否开启多选，长度与总级别相等，false不开启、true开启
 * @property {Array} selected 筛选器的默认选项，长度与总级别相等
 * @function getType 获取选中选项，返回一个或多个选中选项的名字与索引的队列数组, 取消选择返回空数组
 */
import filterDiv from '@/components/TypeFilter'
export default {
  name: 'MultiFilter',
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
      menuShow: [true]
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
    getSelectedType(arr) { // 获取选中选项的队列
      const res = []
      for (const item of arr) {
        const selectedType = [item.index]
        const realList = []
        for (let i = this.levels - 1; i > 0; i--) {
          const parent = this.parentMenuNameList[i][selectedType[0]]
          const firstIndex = this.parentMenuNameList[i].indexOf(parent)
          const realIndex = selectedType[0] - firstIndex
          realList.unshift(realIndex)
          selectedType.unshift(this.parentMenuIndexList[i][selectedType[0]])
        }
        realList.unshift(selectedType[0])
        let node = this.inputData
        const names = []
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
          const nextMenu = [] // 下一级选项
          const theParentIndex = [] // 下一级选项的父选项的索引
          const theParentName = [] // 下一级选项的父选项的名称
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
          this.$emit('getResult', this.getSelectedType(arr))
        }
      } else { // 取消选择 隐藏下级选项
        this.menuShow.map((element, index) => {
          if (index > level) {
            this.$set(this.menuShow, index, false)
          }
        })
        this.$emit('getResult', []) // 返回空数组
      }
    }
  }
}
</script>
