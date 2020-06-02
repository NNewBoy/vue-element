<template>
  <div class="app-container">
    <Collapse :init-show="true">
      <template slot="title">
        筛选<i class="header-icon el-icon-info" />
      </template>
      <LazyFilter
        filter-name="产品目录"
        :load="loadFun"
        :level="4"
        @getResult="getResult"
      />
      <el-row>
        <el-col :span="10">
          <StatusFilter @selectStatus="selectStatus" />
        </el-col>
        <el-col :span="10">
          <BrandsFilter @selectBrands="selectBrands" />
        </el-col>
      </el-row>
    </Collapse>
    <br>
    <div class="menu-list">
      <div class="menu-item">
        <el-input
          v-model="listQuery.search"
          clearable
          size="small"
          placeholder="查找"
          prefix-icon="el-icon-search"
        />
        <el-button type="primary" icon="el-icon-search" size="small" @click="onSearch" />
      </div>
      <div class="menu-item radio-menu">
        <el-button-group class="brand-button">
          <el-button type="success" size="small" @click="saveProperty">保存</el-button>
          <el-button type="warning" size="small" @click="resetProperty">重置</el-button>
        </el-button-group>
      </div>
    </div>
    <br>
    <el-table
      ref="tbTable"
      v-loading="loadingList"
      v-el-table-infinite-scroll="loadNextPage"
      :data="dataList"
      :row-style="tableRowStyle"
      element-loading-text="Loading"
      height="80vh"
      border
      fit
      highlight-current-row
      class="tb-edit"
      @selection-change="handleSelectionChange"
      @cell-click="onClickTb"
    >
      <el-table-column
        type="selection"
        width="45"
      />
      <el-table-column align="center" label="ID" width="50">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="删除" align="center" width="82" class-name="mini-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button
            v-if="row.status!='deleted'"
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="onDelete(row,$index)"
          />
        </template>
      </el-table-column>
      <CommonColumn label="名称" min-width="150" value="name" />
      <CommonColumn label="型号" min-width="150" value="modelno" />
    </el-table>
    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.per_page" @pagination="fetchData" /> -->
  </div>
</template>

<script type="text/javascript">
import elTableInfiniteScroll from 'el-table-infinite-scroll'
import { editDelete } from '@/utils/edit'
import { confirmEdit } from '@/utils/edit'
import { getProductDir, getProductList } from '@/api/product'
import LazyFilter from '@/components/LazyFilter'
import CommonColumn from '@/components/MaterialEdit/column/CommonColumn'
import BrandsFilter from '@/components/MaterialEdit/filter/BrandsFilter'
import StatusFilter from '@/components/MaterialEdit/filter/StatusFilter'
import Collapse from '@/components/Collapse'
// import toPinyin from '@/utils/chineseToPinyin'
// import Pagination from '@/components/Pagination'

export default {
  directives: {
    'el-table-infinite-scroll': elTableInfiniteScroll
  },
  components: { LazyFilter, CommonColumn, BrandsFilter, StatusFilter, Collapse /*, Pagination*/ },
  data() {
    return {
      searchText: '',
      searchTarget: 'name',
      loadingList: false,
      dataList: [],
      selection: [], // 选中的行
      selectedItem: [], // 选中的选项
      selectStatusRes: {}, // 上架状态筛选器的返回值
      selectBrandsRes: {}, // 品牌筛选器的返回值
      ifUpdate: false, // 判断是否刷新数据
      // 翻页参数
      listQuery: {
        page: 1,
        per_page: 20,
        search: undefined
      },
      total: 0
      // tableHeight: 600
    }
  },
  computed: {
    // tableDataFilter: function() {
    //   return this.dataList.filter(el => {
    //     const txt = el[this.searchTarget]
    //     const st = this.searchText.toUpperCase()
    //     return txt.toUpperCase().indexOf(st) >= 0 ||
    //       toPinyin.getFirstLetter(txt).indexOf(st) >= 0 ||
    //       toPinyin.chineseToPinYin(txt).toUpperCase().indexOf(st) >= 0
    //   })
    // }
    // tableHeight() {
    //   if (this.$refs.tbTable) {
    //     return window.innerHeight - this.$refs.tbTable.$el.offsetTop - 50
    //   }
    //   return 500
    // }
  },
  mounted() {
    // this.tableHeight = window.innerHeight - this.$refs.tbTable.$el.offsetTop - 400
  },
  methods: {
    async loadFun(node, resolve) {
      let pathName = null
      if (node.length !== 0) {
        pathName = node.join('/')
      }
      const { data } = await getProductDir(pathName)
      let res = []
      if (data) {
        res = data.map(val => val.label)
      }
      return resolve(res)
    },
    async fetchData() {
      this.listQuery.page = 1
      if (this.selectedItem.length > 0) {
        this.loadingList = true
        const { data } = await getProductList(this.selectedItem.join('\\'), this.listQuery)
        data.items.forEach(el => { el.changed = false })
        this.dataList = data.items
        this.total = data.total
        this.loadingList = false
      }
    },
    getResult(arr) {
      this.selectedItem = JSON.parse(JSON.stringify(arr))
      if (arr.length > 0) {
        this.fetchData()
      } else {
        this.dataList = []
      }
    },
    tableRowStyle({ row, rowIndex }) {
      return row.changed === 1 ? { 'background-color': 'PeachPuff' } : ''
    },
    selectStatus(res) {
      this.selectStatusRes = res
      this.ifUpdate = true
    },
    selectBrands(res) {
      this.selectBrandsRes = res
      this.ifUpdate = true
    },
    saveProperty() {
      const editedArr = this.dataList.filter(item => item.changed)
      if (editedArr.length > 0) {
        confirmEdit(() => {
          this.loadingList = true
          // updateDoorStyle(editedArr)
          //   .then(response => {
          this.loadingList = false
          this.$message.editOk()
          this.fetchData()
          //   })
          //   .catch(() => {
          //     this.loadingList = false
          //     this.$notify.editError()
          //   })
        })
      }
    },
    resetProperty() {
      this.searchText = ''
      this.fetchData()
    },
    onClickTb(row, column, cell, event) { // 表格聚焦
      this.$nextTick(() => {
        const input = cell.querySelector('input')
        if (input) {
          input.focus()
        }
      })
    },
    handleSelectionChange(selection) {
      this.selection = selection
    },
    onDelete(row, index) {
      editDelete(() => {
        this.loadingList = true
        // deleteDoorStyle(row.id).then(response => {
        this.$notify.deleteOk()
        this.dataList.splice(index, 1)
        this.loadingList = false
        // }).catch(() => {
        //   this.loadingList = false
        // })
      })
    },
    onSearch() {
      this.listQuery.page = 1
      this.fetchData()
    },
    async loadNextPage() {
      this.listQuery.page++
      const { data } = await getProductList(this.selectedItem.join('\\'), this.listQuery)
      if (data && data.items) {
        data.items.forEach(el => { el.changed = false })
        this.dataList = this.dataList.concat(data.items)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-list{
  display: flex;
  left: 0px;
  align-items: center;
}
.menu-item{
  display: flex;
  align-items: center;
  margin-right: 20px;
}
</style>
