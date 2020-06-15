<template>
  <div class="app-container">
    <el-backtop :bottom="100" />
    <div style="height:40px">
      <el-col :span="5">
        <el-input v-model="listQuery.search" size="mini" prefix-icon="el-icon-search" clearable placeholder="查找" />
      </el-col>
      <el-button type="primary" size="mini" icon="el-icon-search" @click="btnSearch" />
      <el-button type="success" icon="el-icon-plus" size="mini" @click="btnAddData">新增</el-button>
      <el-button type="danger" icon="el-icon-close" size="mini" @click="btnDeleteData">删除</el-button>
      <el-button type="warning" icon="el-icon-document" size="mini" @click="btnSaveData">保存</el-button>
      <el-button type="primary" icon="el-icon-refresh" size="mini" @click="btnReset">重置</el-button>
      <!-- <li><upload-excel action="/doorinner/import" :on-success="onExcelSuccess" :visible="true" /></li> -->
    </div>
    <vxe-table
      ref="xTable"
      keep-source
      edit-config
      :data="datas"
      :mouse-config="{selected: true}"
      :keyboard-config="{isArrow: true, isDel: true, isEnter: true, isTab: true, isEdit: true}"
    >
      <vxe-table-column type="seq" title="ID" width="60" />
      <vxe-table-column type="checkbox" title="" width="60" />
      <vxe-table-column field="obj_name" title="物体名" :edit-render="{name: 'input'}" width="300" sortable />
      <vxe-table-column field="mat_list" title="材料" width="350">
        <template v-slot="{row}">
          <multi-mat-list :data="row.mat_list" :on-change="onMatListChange.bind(null, row)" />
        </template>
      </vxe-table-column>
    </vxe-table>
    <vxe-pager
      :current-page="listQuery.page"
      :page-size="listQuery.per_page"
      :total="total"
      @page-change="onPageChange"
    />
  </div>
</template>

<script>
import { deleteSelMatGroup, updateSelMatGroup, getSelMatGroup } from '@/api/material'
import { editDelete, confirmEdit } from '@/utils/edit'
import MultiMatList from '@/components/MultiMatList'

export default {
  components: { MultiMatList },
  data() {
    return {
      listLoading: false,
      datas: [],
      // 翻页参数
      listQuery: {
        page: 1,
        per_page: 20,
        search: undefined
      },
      total: 0
    }
  },
  computed: {
  },
  created() {
    this.fetchData(true)
  },
  methods: {
    async fetchData(reset = true) {
      if (reset) {
        this.listQuery.page = 1
        this.datas = []
      }
      this.listLoading = true
      const { data } = await getSelMatGroup(this.listQuery)
      this.datas = this.datas.concat(data.items)
      this.total = data.total

      this.listLoading = false
    },
    btnDeleteData() {
      const rows = this.$refs.xTable.getCheckboxRecords()
      if (rows.length > 0) {
        const ids = rows.map(element => element.id)
        editDelete(() => {
          this.listLoading = true
          deleteSelMatGroup(ids)
            .then(response => {
              this.$notify.deleteOk()
              this.datas = this.datas.filter(el => {
                return !ids.find(id => id === el.id)
              })
              this.listLoading = false
            })
            .catch(() => {
              this.listLoading = false
            })
        })
      }
    },
    btnAddData() {
      var newRow = { id: null, obj_name: '', obj_name_en: '', mat_list: [] }
      this.$refs.xTable.insert(newRow)
    },
    onMatListChange(row) {
      // row.changed = true
    },
    btnReset() {
      this.listQuery.search = ''
      this.fetchData(true)
    },
    btnSaveData(row, index) {
      const { insertRecords, updateRecords } = this.$refs.xTable.getRecordset()
      const editedArr = insertRecords.concat(updateRecords)
      if (editedArr.length > 0) {
        confirmEdit(() => {
          this.listLoading = true
          updateSelMatGroup(editedArr)
            .then(response => {
              this.listLoading = false
              this.$message.editOk()
              this.fetchData(true)
              this.selRow = false
            })
            .catch(() => {
              this.listLoading = false
              this.$notify.editError()
            })
        })
      }
    },
    btnSearch() {
      this.fetchData(true)
    },
    onPageChange({ currentPage, pageSize }) {
      this.listQuery.page = currentPage
      this.listQuery.per_page = pageSize
      this.fetchData()
    }
  }
}
</script>
