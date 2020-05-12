<template>
  <div class="app-container">
    <MultiFilter
      class="multi-filter-container"
      :datas="cascaderDatas"
      :filter-names="['材质分类','材质系列']"
      :multi-choices="[false,false]"
      :selected="selected"
      @getResult="getResult"
    />
    <el-table
      ref="tbTable"
      v-loading="vLoading"
      class="el-table-container"
      :data="mats"
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
      <el-table-column align="center" label="名称" width="200">
        <template slot-scope="{row}">
          {{ row.name }}
        </template>
      </el-table-column>
      <brand-column />
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.per_page" @pagination="mats=[]" />
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">
        取消
      </el-button>
      <el-button type="primary" @click="onDir1">
        选择1级目录
      </el-button>
      <el-button type="primary" @click="onDir2">
        选择2级目录
      </el-button>
      <el-button type="primary" @click="onOk">
        选择材料
      </el-button>
    </div>
  </div>
</template>

<script type="text/javascript">
import { getCatalog, getMat } from '@/api/material'
import MultiFilter from '@/components/MultiFilter'
import BrandColumn from '@/components/BrandColumn'
import Pagination from '@/components/Pagination'

export default {
  name: 'MaterialSelect',
  components: { MultiFilter, BrandColumn, Pagination },
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
    },
    initDir1: {
      require: false,
      type: String,
      default: ''
    },
    initDir2: {
      require: false,
      type: String,
      default: ''
    },
    initName: {
      require: false,
      type: String,
      default: ''
    }
  },
  data() {
    return {
      mats: [],
      listQuery: {
        page: 1,
        per_page: 20,
        name: undefined
      },
      total: 0,
      cascaderDatas: [],
      nowCatalog: [],
      selected: []
    }
  },
  watch: {
    initDir1: {
      immediate: true,
      handler(val) {
        this.$set(this.selected, 0, val)
        if (this.initDir2 === '') {
          this.fetchData()
        }
      }
    },
    initDir2: {
      immediate: true,
      handler(val) {
        this.$set(this.selected, 1, val)
        this.fetchData()
      }
    }
  },
  methods: {
    async fetchData() {
      const { data } = await getCatalog()
      // 设置符合el-cascader的目录数据
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
      this.cascaderDatas = calCatalog(data)
    },
    async fetchMaterial() {
      this.listLoading = true
      const { data } = await getMat(this.nowCatalog[0], this.nowCatalog[1], this.listQuery)
      this.mats = data.items
      this.total = data.total
      this.listLoading = false

      this.$refs.tbTable.clearSelection()
      if (this.initName !== '') {
        this.mats.filter(row => {
          if (row.name === this.initName) {
            this.$nextTick(() => {
              this.$refs.tbTable.toggleRowSelection(row)
            })
            return
          }
        })
      }
    },
    getResult(arr) {
      if (arr.length > 0) {
        this.nowCatalog = arr[0].map(item => item.name)
        this.fetchMaterial()
      } else {
        this.mats = []
        this.total = 0
        this.nowCatalog = []
      }
    },
    onCancel() {
      this.$emit('cancel')
    },
    onOk() {
      this.$emit('selectMat', this.$refs.tbTable.selection)
    },
    onDir1() {
      this.$emit('selectDir1', this.nowCatalog[0])
    },
    onDir2() {
      this.$emit('selectDir2', this.nowCatalog[0], this.nowCatalog[1])
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
.multi-filter-container{
  text-align: left;
}
.el-table-container{
  margin: 20px 0;
}
</style>
