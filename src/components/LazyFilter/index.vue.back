<template>
  <div>
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
      nowLevel: 1 // 筛选器级别
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
    getMenu(params, level) {
      for (let i = level; i < this.level; i++) {
        if (i > level) {
          this.$set(this.menuShow, i, false)
        } else if (i === level) {
          this.$set(this.menuShow, i, true)
        }
      }
      this.$set(this.vLoading, level, true)
      this.load(params, (data) => {
        // const temp = []
        // for (const i of data) {
        //   temp.push({ name: i, selected: false })
        // }
        // this.$set(this.filterData, level, temp)
        this.$set(this.menuList, level, data)
        this.$set(this.vLoading, level, false)
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
          this.getMenu(this.nowSelected.slice(0, level + 1), level + 1)
        } else if (level === this.level - 1) {
          this.selected.splice(0, this.selected.length)
          this.$emit('getResult', this.nowSelected)
        }
      } else { // 取消选择 隐藏下级选项
        this.menuShow.forEach((element, index) => {
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
