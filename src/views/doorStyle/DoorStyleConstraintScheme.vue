<template>
  <div class="app-container">
    <el-col :span="5">
      <el-input
        v-model="searchText"
        size="mini"
        clearable
        placeholder="查找"
      />
    </el-col>
    <el-button
      type="primary"
      size="mini"
      icon="el-icon-search"
      style="margin-top:0px;"
      @click="onSearch"
    />
    <el-button
      type="primary"
      size="mini"
      icon="el-icon-plus"
      style="margin-top:0px;"
      @click="onNew"
    >
      添加
    </el-button>
    <el-button
      type="primary"
      size="mini"
      icon="el-icon-check"
      style="margin-top:0px;"
      @click="onSaveAll"
    >
      保存
    </el-button>
    <el-table
      v-loading="listLoading"
      :data="datas"
      :row-style="tableRowStyle"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      class="tb-edit"
    >
      <el-table-column type="expand" label="展开" width="80">
        <template slot-scope="{row}">
          <div>
            <!-- {{ row.door_styles }} -->
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-plus"
              style="margin-top:0px;"
              @click="onAddDoorStyle(row)"
            >
              添加
            </el-button>
            <el-table
              :data="row.door_styles"
              border
              fit
              highlight-current-row
              class="tb-edit"
            >
              <el-table-column align="center" label="ID" width="50">
                <template slot-scope="scope">
                  {{ scope.$index + 1 }}
                </template>
              </el-table-column>
              <el-table-column v-for="item in doorStyleOptions" :key="item.key" :label="item.name" align="center" :width="item.width">
                <template slot-scope="scope">
                  <el-input v-model="scope.row[item.key]" size="small" placeholder="请输入内容" @change="onEditDoorStyle(row,scope.$index)" />
                  <span>{{ scope.row[item.key] }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="80">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                    @click="onDeleteDoorStyle(row,scope.$index)"
                  />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <!-- {{ scope.$index + 1 }} -->
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="名称" width="300">
        <template slot-scope="{row}">
          <el-input v-model="row.name" size="small" placeholder="请输入内容" @change="onEdit(row)" />
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="说明">
        <template slot-scope="{row}">
          <el-input v-model="row.comment" size="small" placeholder="请输入内容" @change="onEdit(row)" />
          <span>{{ row.comment }}</span>
        </template>
      </el-table-column>
      <el-table-column label="门板数量" width="120" align="center">
        <template slot-scope="{row}">
          {{ row.door_styles.length }}
        </template>
      </el-table-column>

      <sku-status-column />

      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="{row,$index}">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-check"
            @click="onSave(row,$index)"
          />
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="onDelete(row,$index)"
          />
        </template>
      </el-table-column>

    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.per_page" @pagination="fetchData" />
    <el-dialog title="选择门板款式" :visible.sync="dialogFormVisible" width="90%" height="90%" style="z-index:999999">
      <door-style-select @cancel="dialogFormVisible=false" @selectDoorStyle="onSelectDoorStyle" />
    </el-dialog>
  </div>
</template>

<script>
import { getDoorStyleScheme, addDoorStyleScheme, updateDoorStyleScheme, delDoorStyleScheme } from '@/api/doorstyle'
import Pagination from '@/components/Pagination'
import SkuStatusColumn from '@/components/SkuStatusColumn2'
import { confirmEdit, confirmDelete } from '@/utils/edit'
import DoorStyleSelect from '@/components/DoorStyleSelect'

export default {
  components: { Pagination, SkuStatusColumn, DoorStyleSelect },
  data() {
    return {
      listLoading: false,
      dialogFormVisible: false,
      searchText: '',
      datas: [],
      doorStyleOptions: [
        { key: 'door_series', name: '门板系列', width: 220 },
        { key: 'door_price', name: '门板价格', width: 220 },
        { key: 'door_shape', name: '门板造型', width: 220 },
        { key: 'door_ext4', name: 'ext4', width: 80 },
        { key: 'door_ext5', name: 'ext5', width: 80 },
        { key: 'door_ext6', name: 'ext6', width: 80 },
        { key: 'door_color', name: '门板颜色', width: 220 }
      ],
      listQuery: {
        page: 1,
        per_page: 20,
        name: undefined
      },
      total: 0,
      editRow: null
    }
  },
  computed: {
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.listLoading = true
      const { data } = await getDoorStyleScheme(this.searchText, this.listQuery)
      data.items.forEach(el => {
        el.editStatus = 0
      })
      this.datas = data.items
      this.total = data.total
      // console.log(data)
      this.listLoading = false
    },
    onSearch() {
      this.listQuery.page = 1
      this.fetchData()
    },
    onNew() {
      this.datas.unshift({ id: null, name: '', comment: '', mode: 0, door_styles: [], status: 0, editStatus: 0 })
    },
    onEditDoorStyle(row, index) {
      const indexRow = this.datas.findIndex(v => v.id === row.id)
      this.datas[indexRow].editStatus = 1
    },
    onDeleteDoorStyle(row, index) {
      const indexRow = this.datas.findIndex(v => v.id === row.id)
      row['door_styles'].splice(index, 1)
      this.datas[indexRow] = row
      this.datas[indexRow].editStatus = 1
    },
    onEdit(row) {
      if (row.editStatus === 0) {
        row.editStatus = 1 // 修改
      }
    },
    tableRowStyle({ row, rowIndex }) {
      return row.editStatus === 1 ? { 'background-color': 'PeachPuff' } : ''
      // return ''
    },
    onSaveAll() { // 已修改的数据数组，待上传
      const editedArr = this.datas.filter(item => item.editStatus === 1)
      console.log(editedArr)
    },
    onSave(row, index) {
      confirmEdit(() => {
        this.listLoading = true
        if (row.id) {
          updateDoorStyleScheme(row)
            .then(response => {
              row.editStatus = 0
              this.listLoading = false
              this.$message.editOk()
            })
            .catch(() => {
              this.listLoading = false
            })
        } else {
          addDoorStyleScheme(row)
            .then(res => {
              row.editStatus = 0
              this.$notify.addOk()
              row.id = res.data.id
              this.listLoading = false
            })
            .catch(() => {
              this.listLoading = false
            })
        }
      })

      this.editRow = null
    },
    onDelete(row, index) {
      confirmDelete(() => {
        this.listLoading = true
        delDoorStyleScheme(row.id)
          .then(res => {
            this.$notify.deleteOk()
            this.datas.splice(index, 1)
            this.listLoading = false
          })
          .catch(() => {
            this.listLoading = false
          })
      })
    },
    onAddDoorStyle(row) {
      this.dialogFormVisible = true
      this.editRow = row
    },
    onSelectDoorStyle(dss) {
      // console.log(dss)
      if (dss instanceof Array) {
        dss.forEach(el => {
          this.editRow.door_styles.push(el)
        })
      } else {
        this.editRow.door_styles.push(dss)
      }
      const indexRow = this.datas.findIndex(v => v.id === this.editRow.id)
      this.datas[indexRow].editStatus = 1

      this.editRow = null
      this.dialogFormVisible = false
    }
  }
}
</script>

<style scope>
.tb-edit .el-input {
  display: none
}
.tb-edit .current-row .el-input {
  display: block
}
.tb-edit .current-row .el-input+span {
  display: none
}
</style>
