<template>
  <div class="lazy-filter-container">
    <div
      v-for="(item,index) in menuList"
      :key="index"
    >
      <filterDiv
        v-show="menuShow[index]"
        v-loading="vLoading[index]"
        :data="item"
        :level="index"
        :filter-name="nameList[index]"
        :multi-choice="multiChoices[index]"
        :selected="selected[index]"
        @getType="getType"
      />
    </div>
  </div>
</template>

<script type="text/javascript">
/**
 * @property {Array} selected 筛选器的默认选项
 * @property {String} filterName 筛选器名称
 * @property {Number} level 筛选器的级别
 * @property {Function} load 每一级筛选器调用的懒加载函数，格式为 async func(node, resolve){... return resolve(res)},node为输入父组件的已选择选项数组[selected1,selected2...],res为返回该组件的选项数组[item1,item2...]
 * @function getResult 获取选中选项，返回一个或多个选中选项的名字与索引的队列数组(对应单选和多选), 取消选择返回空数组
 */
import filterDiv from '@/components/TypeFilter'
export default {
  name: 'MultiFilter',
  components: { filterDiv },
  props: {
    selected: {
      type: Array,
      default() {
        return []
      }
    },
    filterName: {
      require: false,
      type: String,
      default: ''
    },
    level: {
      require: false,
      type: Number,
      default: 1
    },
    load: {
      require: true,
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      // filterData: [], // 各级选项及选择与否 [{name,selected}]
      menuList: [], // 各级选项 [name]
      menuShow: [true], // 各级菜单显示
      vLoading: [false], // 各级菜单刷新
      nowSelected: [], // 当前选择的选项名
      nowLevel: 1, // 筛选器级别
      preSelection: {}, // 上一个选项
      shouldRecall: false // 下一次选择是否需要匹配
    }
  },
  computed: {
    nameList: function() {
      const res = [this.filterName]
      for (let i = 0; i < this.level - 1; i++) {
        res.push('')
      }
      return res
    },
    multiChoices: function() {
      const res = []
      for (let i = 0; i < this.level; i++) {
        res.push(false)
      }
      return res
    }
  },
  created() {
    this.getMenu([], 0)
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
    getMenu(params, level) {
      this.$set(this.menuShow, level, true)
      this.$set(this.vLoading, level, true)
      this.load(params, (data) => {
        // const temp = []
        // for (const i of data) {
        //   temp.push({ name: i, selected: false })
        // }
        // this.$set(this.filterData, level, temp)
        this.$set(this.menuList, level, data)
        this.$set(this.vLoading, level, false)
        if (data.length === 0 || !data) {
          for (let i = level + 1; i < this.level; i++) {
            this.$set(this.menuList, i, [])
          }
          this.shouldRecall = true
        }
      })
    },
    getType(arr, level) {
      if (arr.length > 0) {
        // const selectedIndex = arr[0].index
        const name = arr[0].name
        // const nowMenu = this.filterData[level]
        // nowMenu.forEach((item, index) => {
        //   if (index === selectedIndex) {
        //     item.selected = true
        //   } else {
        //     item.selected = false
        //   }
        // })
        this.$set(this.nowSelected, level, name)

        if (level < this.level - 1) {
          if (this.shouldRecall) { // 当前不是在最高级别筛选器中选择时，匹配历史选择
            const matchStr = JSON.stringify(this.nowSelected.slice(0, level + 1))
            const tempSelected = this.preSelection[matchStr]
            this.shouldRecall = false
            if (tempSelected) {
              tempSelected.map((item, index) => {
                this.$set(this.selected, index, tempSelected[index])
              })
              const temp = JSON.parse(JSON.stringify(this.menuList[level]))
              this.$set(this.menuList, level, temp) // 重新选择
              return
            }
          }
          this.getMenu(this.nowSelected.slice(0, level + 1), level + 1)
        } else if (level === this.level - 1) {
          this.getKey(this.nowSelected)
          this.$emit('getResult', this.nowSelected)
          this.shouldRecall = true // 下一次选择需要匹配
        }
      } else { // 取消选择 隐藏下级选项
        this.menuShow.forEach((element, index) => {
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
<style lang="scss">
.lazy-filter-container {
  .type-filter-container{
    padding-right: 75px;
  }
  .selected-control{
    width: auto;
  }
}
</style>
