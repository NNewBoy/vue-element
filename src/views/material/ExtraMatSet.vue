<template>
  <div class="app-container">
    <el-backtop :bottom="100" />
    <el-table
      ref="tb"
      v-loading="listLoading"
      :data="datas"
      :row-style="tableRowStyle"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      class="tb-edit"
      @cell-click="onClickTb"
    >
      <el-table-column align="center" label="ID" width="50">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称" width="200">
        <template slot-scope="{row}">
          <el-input v-model="row.name" size="small" placeholder="请输入内容" @change="onEdit(row)" />
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="隐藏" width="200">
        <template slot-scope="{row}">
          <el-switch v-model="row.hide" :active-value="1" :inactive-value="0" @change="onEdit(row)" />
          <!-- {{ row.hide | boolean }} -->
        </template>
      </el-table-column>
      <el-table-column align="center" label="默认目录1" width="200">
        <template slot-scope="{row}">
          <el-input v-model="row.default_use_group" size="small" placeholder="请输入内容" @change="onEdit(row)" />
          <span>{{ row.default_use_group }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="默认目录2" width="200">
        <template slot-scope="{row}">
          <el-input v-model="row.default_texture_group" size="small" placeholder="请输入内容" @change="onEdit(row)" />
          <span>{{ row.default_texture_group }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="默认材料名" width="200">
        <template slot-scope="{row}">
          <el-input v-model="row.default_mat_name" size="small" placeholder="请输入内容" @change="onEdit(row)" />
          <span>{{ row.default_mat_name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="删除" align="center" width="150">
        <template slot-scope="{row,$index}">
          <el-button
            v-if="row.status!='deleted'"
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="onDelete(row, $index)"
          />
        </template>
      </el-table-column>
    </el-table>
    <div id="addNewData">
      <el-button type="primary" icon="el-icon-plus" @click="onAddRow">新增</el-button><br><br>
      <el-button type="primary" icon="el-icon-document" @click="onSave">保存</el-button>
    </div>
  </div>
</template>

<script>
import { getExtraSet, deleteExtraSet, editExtraSet } from '@/api/material'
import { editDelete, confirmEdit, filterObj } from '@/utils/edit'

export default {
  data() {
    return {
      listLoading: false,
      datas: []
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
      const { data } = await getExtraSet()
      data.forEach(el => {
        el.editStatus = 0
      })
      this.datas = data
      this.listLoading = false
    },
    onEdit(row) {
      row.editStatus = 1 // 修改
    },
    tableRowStyle({ row, rowIndex }) {
      return row.editStatus !== 0 ? { 'background-color': 'PeachPuff' } : ''
      // return ''
    },
    onAddRow() {
      const row = { id: null, name: '', hide: 0, default_use_group: '', default_texture_group: '', default_mat_name: '', editStatus: 1 }
      this.datas.push(row)
      window.scrollTo(0, document.body.scrollHeight)
      this.$refs.tb.setCurrentRow(row)
    },
    onSave() {
      const datas = this.datas.filter(el => el.editStatus === 1)
      if (datas.length > 0) {
        confirmEdit(() => {
          editExtraSet(datas.map(el => filterObj(el, 'editStatus')))
            .then(res => {
              this.$message.editOk()
              this.fetchData()
            })
            .catch(() => {
              this.$notify.editError()
            })
        })
      }
    },
    onDelete(row, index) {
      editDelete(() => {
        if (row.id === null) {
          this.datas.splice(index, 1)
        } else {
          this.listLoading = true
          deleteExtraSet(row.id)
            .then(response => {
              this.$notify.deleteOk()
              this.datas.splice(index, 1)
              this.listLoading = false
            })
            .catch(() => {
              this.listLoading = false
            })
        }
      })
    },
    onClickTb(row, column, cell, event) {
      this.$nextTick(() => {
        const input = cell.querySelector('input')
        if (input) {
          input.focus()
        }
      })
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
#addNewData{
  width: 100px;
  height: 120px;
  padding: 2px;
  color: #ddd;
  border: 0px;
  transform: translate(0, -50%);
  border-radius: 5px;
  position: fixed;
  top:100px;
  right: 20px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  z-index: 99;
}
</style>
