<template>
  <div>
    <MultiFilter
      :key="key"
      :datas="filterData"
      :filter-names="nameList"
      :multi-choices="choiceList"
      :selected="selected"
      @getResult="getResult"
    />
  </div>
</template>

<script type="text/javascript">
import MultiFilter from '@/components/MultiFilter'
export default {
  components: { MultiFilter },
  props: {
    filterName: {
      require: false,
      type: String,
      default: ''
    },
    load: {
      require: true,
      type: Function,
      default: () => {}
    },
    level: {
      require: false,
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      filterData: [],
      key: 1,
      selected: [],
      nowLevel: 1 // 筛选器级别
    }
  },
  computed: {
    nameList: function() {
      const res = [this.filterName]
      for (let i = 0; i < this.nowLevel - 1; i++) {
        res.push('')
      }
      return res
    },
    choiceList: function() {
      const res = []
      for (let i = 0; i < this.nowLevel; i++) {
        res.push(false)
      }
      return res
    }
  },
  created() {
    this.load([], (data) => {
      this.filterData = data
    })
  },
  methods: {
    getResult(arr) {
      console.log(arr)
      if (arr.length > 0) {
        const first = arr[0]
        const tempData = JSON.parse(JSON.stringify(this.filterData))
        const resList = first.map(val => val.name)
        let temp = tempData[first[0].index]
        for (let i = 1; i < first.length; i++) {
          temp = temp.children[first[i].index]
        }
        if (first.length < this.level) {
          this.load(resList, (data) => {
            if (data && data.length > 0) {
              this.nowLevel = first.length + 1
              this.selected = resList
              temp.children = data
              this.filterData = tempData
              this.key++
            } else {
              this.filterData = tempData
              this.nowLevel = first.length
              this.selected = resList
            }
          })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
