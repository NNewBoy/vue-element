<template>
  <div class="app-container">
    <el-backtop :bottom="100" />
    <el-table
      id="tbl-data"
      v-loading="listLoading"
      :data="datas"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="50">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column align="center" label="物体名" width="200">
        <template slot-scope="{row}">
          <span v-if="row.edit">
            <input v-model="row.obj_name" autofocus @change="onInputValChange(row)">
          </span>
          <span v-else>
            <router-link :to="`/kitsun_v10/kitsun_v10/material/selobj/1/${row.obj_name}`">
              {{ row.obj_name }}
            </router-link>
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="材料" width="320">
        <template slot-scope="{row}">
          <multi-mat-list :data="row.mat_list" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="200" class-name="mini-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-dropdown v-if="row.edit" size="mini" @command="dropdownCmd">
            <el-button
              type="success"
              size="mini"
              icon="el-icon-circle-check-outline"
              @click="handleEditOK(row)"
            >
              确定
              <i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="beforeCommand('cancel', row)">取消</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button
            v-else
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="onBtnAlter(row,$index)"
          >修改</el-button>
          <el-button
            v-if="row.status!='deleted'"
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(row,$index)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div id="addNewData">
      <el-button type="primary" icon="el-icon-plus" @click="tableAddRow">新增</el-button>
    </div>
  </div>
</template>

<script>
import { deleteSelMatGroup, editSelMatGroup, getSelMatGroup, addSelMatGroup, getCatalog } from '@/api/material'
import { editDelete } from '@/utils/edit'
import MultiMatList from '@/components/MultiMatList'

const matPropArr = [
  // { key: 'obj_name', name: '物体名', width: 200 },
  { key: 'mat_dir1', name: '材料1级目录', width: 200 },
  { key: 'mat_dir2', name: '材料2级目录', width: 200 },
  { key: 'mat_name', name: '材料名称', width: 200 },
  { key: 'modelno', name: '材料型号', width: 200 }
]

export default {
  components: { MultiMatList },
  data() {
    return {
      listLoading: false,
      datas: [],
      newItem: { obj_name: '', main_obj_name: '' },
      catalog: [],
      matDir1Arr: [],
      matDir2Arr: [],
      matProps: matPropArr,
      editRow: { obj_name: '', mat_dir1: '', mat_dir2: '', mat_name: '', modelno: '', change: false, edit: false },
      hideAddBtn: false
    }
  },
  computed: {
    enableAdd: function() {
      if (
        this.newItem.obj_name.length <= 2 ||
        this.newItem.main_obj_name.length <= 2
      ) {
        return false
      }
      return (
        !this.datas.find(item => item.obj_name === this.newItem.obj_name) &&
        this.newItem.obj_name !== this.newItem.main_obj_name
      )
    }
  },
  created() {
    this.fetchData()
    this.fetchCatalog()
  },
  methods: {
    async fetchCatalog() {
      const { data } = await getCatalog()
      this.catalog = data
      this.matDir1Arr = []
      for (const x in this.catalog) {
        this.matDir1Arr.push(x)
      }
    },
    async fetchData() {
      this.listLoading = true
      const { data } = await getSelMatGroup()
      const tmpArr = data
      for (let i = 0; i < tmpArr.length; i++) {
        tmpArr[i].edit = false
        tmpArr[i].change = false
      }
      this.datas = tmpArr
      this.listLoading = false
    },
    getDir2Arr(s) {
      if (s === '' || s === null || s === undefined) {
        return
      }
      this.matDir2Arr = []
      for (const x in this.catalog) {
        if (x === s) {
          this.matDir2Arr = this.catalog[x]
          break
        }
      }
    },
    setDir2Arr(row, s) {
      row.change = true
      this.getDir2Arr(s)
    },
    handleDelete(row, index) {
      editDelete(() => {
        this.listLoading = true
        deleteSelMatGroup(row.id)
          .then(response => {
            this.$notify.deleteOk()
            this.datas.splice(index, 1)
            this.listLoading = false
          })
          .catch(() => {
            this.listLoading = false
          })
      })
    },
    handleAdd() {
      // this.listLoading = true
      // this.newItem.obj_name = this.newItem.obj_name.toUpperCase()
      // this.newItem.main_obj_name = this.newItem.main_obj_name.toUpperCase()
      // addSetCtrl(this.newItem.obj_name, this.newItem.main_obj_name).then(response => {
      //   this.$notify.addOk()
      //   // 可考虑重新拿数据
      //   // this.fetchData()
      //   const n = { obj_name: this.newItem.obj_name, main_obj_name: this.newItem.main_obj_name, enable: true }
      //   this.$set(n, 'edit', false)
      //   this.datas.push(n)
      //   this.listLoading = false
      // }).catch(() => {
      //   this.listLoading = false
      // })
    },
    handleEditOK(row) {
      if (row.new) {
        if (row.obj_name === '' || row.obj_name === null || row.obj_name === undefined) {
          this.$message.error('物体名不能为空！')
          return
        }
        if (row.mat_dir1 === '' || row.mat_dir1 === null || row.mat_dir1 === undefined) {
          this.$message.error('材料1级目录不能为空！')
          return
        }
        if (row.mat_dir2 === '' || row.mat_dir2 === null || row.mat_dir2 === undefined) {
          this.$message.error('材料2级目录不能为空！')
          return
        }
        // if (row.mat_name === '' || row.mat_name === null || row.mat_name === undefined) {
        //   this.$message.error('材料名称不能为空！')
        //   return
        // }
        row.edit = false
        addSelMatGroup(row)
        return
      }
      row.edit = false
      if (!row.change) {
        this.$message.info({ title: '消息', message: '数据未更改！' })
        return
      }
      this.listLoading = true
      row.obj_name = row.obj_name.toUpperCase()
      editSelMatGroup(row)
        .then(response => {
          this.listLoading = false
          this.$message.editOk()
          row.change = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    dropdownCmd(param) {
      if (param.button === 'cancel') {
        if (param.row.new) {
          const i = this.datas.length - 1
          this.datas.splice(i, 1)
          return
        }
        if (param.row.change) {
          param.row.change = false
          param.row.obj_name = this.editRow.obj_name
          param.row.mat_dir1 = this.editRow.mat_dir1
          param.row.mat_dir2 = this.editRow.mat_dir2
          param.row.mat_name = this.editRow.mat_name
          param.row.modelno = this.editRow.modelno
        }
        param.row.main_obj_name = param.row.org_main_obj_name
        param.row.edit = false
      }
    },
    beforeCommand(item, row) {
      return {
        button: item,
        row: row
      }
    },
    isEditing(index) {
      for (let i = 0; i < this.datas.length; i++) {
        if (this.datas[i].edit && index !== i) {
          return true
        }
      }
      return false
    },
    onBtnAlter(row, index) {
      if (this.isEditing(index)) {
        this.$message.warning('请先保存当前编辑项！')
      } else {
        for (const x in row) {
          if (row[x] === null || row[x] === undefined) this.editRow[x] = ''
          else this.editRow[x] = row[x]
        }
        this.getDir2Arr(row.mat_dir1)
        row.edit = true
      }
    },
    onInputValChange(row) {
      row.change = true
    },
    tableAddRow() {
      if (this.isEditing(-1)) {
        this.$message.warning('请先保存当前编辑项！')
      } else {
        this.listLoading = true
        var newRow = { obj_name: '', obj_name_en: '', mat_dir1: '', mat_dir2: '', mat_name: '', modelno: '', new: true, edit: true }
        this.datas.push(newRow)
        window.scrollTo(0, document.body.scrollHeight)
        this.listLoading = false
      }
    },
    onBtnSHClick() {
      const minW = 20
      const maxW = 70
      const speed = 5
      const interval = 10
      var btnAdd = document.getElementById('addNewData')
      var btn = document.getElementById('addNewDataSH')
      btn.disabled = 'disabled'
      var width = 0
      if (!this.hideAddBtn) {
        width = maxW
        var timer = setInterval(() => {
          width -= speed
          btnAdd.style.width = width + 'px'
          if (parseInt(btnAdd.style.width) <= minW) {
            clearInterval(timer)
            btn.disabled = ''
          }
          btnAdd.style.border = '1px solid #eee'
          btnAdd.style.background = 'rgba(255, 255, 255, 0.1)'
        }, interval)
      } else {
        width = minW
        const timer = setInterval(() => {
          width += speed
          btnAdd.style.width = width + 'px'
          if (parseInt(btnAdd.style.width) >= maxW) {
            clearInterval(timer)
            btn.disabled = ''
          }
          btnAdd.style.border = '1px solid #409eff'
          btnAdd.style.background = 'rgba(255, 255, 255, 0.9)'
        }, interval)
      }
      this.hideAddBtn = !this.hideAddBtn
    }
  }
}
</script>

<style scoped>
#table-add-row {
  width: 100%;
  height: 30px;
  margin-top: 10px;
  border: 1px dashed #ddd;
  border-radius: 3px;
  display: flex;
  justify-content: center;
  line-height: 30px;
  cursor: pointer;
}
#tbl-data input {
  display: block;
  width: 100%;
  height: 24px;
  line-height: 24px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin: 3px 1px;
  padding: 4px 6px;
  transition: border-color ease-in-out 0.25s, box-shadow ease-in-out 0.25s;
}
#tbl-data input:focus {
  border-color: #66afe9;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6);
  outline: 0px;
}
#addNewData{
  width: 100px;
  height: 50px;
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
#addNewDataSH{
  font-size: 15px;
  line-height: 24px;
  float: left;
  overflow: hidden;
}
#addNewDataSH:hover{
  color: #00bbec;
}
#addNewDataTxt{
  font-size: 14px;
  line-height: 24px;
  margin: 0 auto;
  overflow: hidden;
}
#addNewDataTxt:hover{
  color: #409eff;
}
</style>
