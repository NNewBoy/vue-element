<template>
  <div class="app-container">
    <MultiFilter
      :datas="catalogs"
      :filter-names="['门板系列','门板价格','门板造型']"
      :multi-choices="[false,false,false]"
      @getResult="getResult"
    />
    <MultiFilter
      :datas="restCatalogs"
      :show-num-len="2"
      :filter-names="['门板Ext4','门板Ext5','门板Ext6']"
      :multi-choices="[false,false,false]"
      @getResult="getResult2"
    />
    <el-table
      ref="tbTable"
      v-loading="vLoading"
      class="el-table-container"
      :data="doorstyleList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column type="selection" align="center" width="80" />
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="门板颜色" width="200">
        <template slot-scope="{row}">
          {{ row.door_color }}
        </template>
      </el-table-column>
      <brand-column />
    </el-table>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onDir1">
        选择门板系列
      </el-button>
      <el-button type="primary" @click="onDir2">
        选择门板价格
      </el-button>
      <el-button type="primary" @click="onDir3">
        选择门板造型
      </el-button>
      <el-button type="primary" @click="onDoorStyle">
        选择门板款式
      </el-button>
    </div>
  </div>
</template>

<script type="text/javascript">
import { getCatalog, getColorList } from '@/api/doorstyle'
import BrandColumn from '@/components/BrandColumn'
import MultiFilter from '@/components/MultiFilter'

export default {
  name: 'DoorStyleSelect',
  components: { BrandColumn, MultiFilter },
  props: {
    data: {
      require: true,
      type: Array,
      default() {
        return []
      }
    },
    vLoading: {
      require: true,
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      catalogs: [],
      loadingDoorColor: false,
      doorstyleList: [],
      selectArr: [],
      restSelectArr: []
    }
  },
  computed: {
    doorStyle() {
      return this.selectArr[0].map(item => item.name).join('\\')
    },
    restDoorStyle() {
      return this.restSelectArr[0].map(item => item.name).join('\\')
    },
    allDoorStyle() {
      return [this.doorStyle, this.restDoorStyle].join('\\')
    },
    restCatalogs() {
      const res = []
      for (const i of this.selectArr) {
        let temp = this.catalogs
        for (const j of i) {
          temp = temp[j.index].children
        }
        res.push(temp)
      }
      return res
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    getResult(arr) {
      if (arr.length > 0) {
        this.selectArr = arr
      } else {
        this.doorstyleList = []
      }
    },
    getResult2(arr) {
      if (arr.length > 0) {
        this.restSelectArr = arr
        this.fetchDoorColor()
      } else {
        this.doorstyleList = []
      }
    },
    async fetchData() {
      const { data } = await getCatalog()

      const calCatalog = (function() {
        return function fun(dirs) {
          const catalogs = []
          for (const dir in dirs) {
            let next = []
            if (Array.isArray(dirs[dir])) {
              dirs[dir].forEach(element => {
                next.push({ name: element })
              })
            } else {
              next = fun(dirs[dir])
            }

            catalogs.push({ name: dir, children: next })
          }
          return catalogs
        }
      })()

      this.catalogs = calCatalog(data)
    },
    async fetchDoorColor() {
      this.loadingDoorColor = true
      const { data } = await getColorList(this.allDoorStyle)
      this.doorstyleList = data
      this.loadingDoorColor = false
    },
    onDoorStyle() {
      const dss = []
      this.$refs.tbTable.selection.forEach(el => {
        dss.push({ door_series: el.door_series, door_price: el.door_price, door_shape: el.door_shape,
          door_ext4: el.door_ext4, door_ext5: el.door_ext5, door_ext6: el.door_ext6, door_color: el.door_color })
      })
      this.$emit('selectDoorStyle', dss)
    },
    onDir1() {
      const ds = this.allDoorStyle.split('\\')
      this.$emit('selectDoorStyle', { door_series: ds[0], door_price: '*', door_shape: '*',
        door_ext4: '*', door_ext5: '*', door_ext6: '*', door_color: '*' })
    },
    onDir2() {
      const ds = this.allDoorStyle.split('\\')
      this.$emit('selectDoorStyle', { door_series: ds[0], door_price: ds[1], door_shape: '*',
        door_ext4: '*', door_ext5: '*', door_ext6: '*', door_color: '*' })
    },
    onDir3() {
      const ds = this.allDoorStyle.split('\\')
      this.$emit('selectDoorStyle', { door_series: ds[0], door_price: ds[1], door_shape: ds[2],
        door_ext4: '*', door_ext5: '*', door_ext6: '*', door_color: '*' })
    }
  }
}
</script>

<style scoped>
.dialog-footer{
  text-align: center;
}
.app-container{
  padding: 0;
}
.el-table-container{
  margin: 20px 0;
}
</style>
