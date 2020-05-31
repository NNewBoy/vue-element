<template>
  <div class="components-container">
    <el-backtop :bottom="100" />
    <el-table
      id="tbl-data"
      v-loading="listLoading"
      :data="datas"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @cell-click="onClickCell"
    >
      <el-table-column align="center" label="ID" width="50">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>

      <el-table-column v-for="o in dirs" :id="`edit_${o}`" :key="o" align="center" :label="`目录${o}`" width="100">
        <template slot-scope="{row}">
          <el-input v-if="row===editRow" v-model="row['dir'+o]" />
          <span v-else>
            {{ row['dir' + o] }}
          </span>
        </template>
      </el-table-column>

      <el-table-column id="edit_modelno" align="center" label="产品型号" width="150">
        <template slot-scope="{row}">
          <el-input v-if="row===editRow" v-model="row.modelno" />
          <span v-else>
            {{ row.modelno }}
          </span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="材料约束" width="320">
        <template slot-scope="{row}">
          <multi-mat-list :data="row.mat_list" />
        </template>
      </el-table-column>

      <el-table-column align="center" label="门板约束" width="320">
        <template slot-scope="{row}">
          <door-style-scheme-list :data="row.door_style_scheme" />
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="160">
        <template slot-scope="{row,$index}">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-check"
            @click="onSave(row,$index)"
          />
          <el-button
            v-if="row.status!='deleted'"
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="onDelete(row,$index)"
          />
          <br><br>
          <router-link to="" target="_blank">
            <span>材料测试</span>
          </router-link>
          <router-link :to="`/kitsun/doorstyle?scheme=${doorStyleSchemeIds(row.door_style_scheme)}`" target="_blank">
            <span>门板测试</span>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <div id="addNewData">
      <el-button type="primary" icon="el-icon-plus" @click="onAddRow">新增</el-button>
    </div>
  </div>
</template>

<script>
import { getContrainList, deleteConstrain, updateConstrain, addConstrain } from '@/api/product'
import MultiMatList from '@/components/MultiMatList'
import DoorStyleSchemeList from '@/components/DoorStyleSchemeList'
import { confirmEdit, confirmDelete } from '@/utils/edit'

export default {
  components: { MultiMatList, DoorStyleSchemeList },
  data() {
    return {
      listLoading: false,
      datas: [],
      dirs: [1, 2, 3, 4],
      editRow: null
    }
  },
  computed: {
    doorStyleSchemeIds() {
      return function(door_style_scheme) {
        const ids = []
        door_style_scheme.forEach(el => ids.push(el.id))
        return ids.join(',')
      }
    }
  },
  watch: {
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const { data } = await getContrainList()
      this.datas = data || []
    },
    onAddRow() {
      if (this.editRow) {
        this.$message.warning('请先保存当前编辑项！')
      } else {
        const newRow = { dir1: '', dir2: '', dir3: '', dir4: '', modelno: '', mat_list: [] }
        this.datas.push(newRow)
        window.scrollTo(0, document.body.scrollHeight)
        this.editRow = newRow
      }
    },
    onSave(row, index) {
      confirmEdit(() => {
        this.listLoading = true
        if (row.id) {
          updateConstrain(row)
            .then(response => {
              this.listLoading = false
              this.editRow = null
              this.$message.editOk()
            })
            .catch(() => {
              this.listLoading = false
            })
        } else {
          addConstrain(row)
            .then(res => {
              // console.log(res)
              this.$notify.addOk()
              row.id = res.data.id
              this.editRow = null
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
        deleteConstrain(row.id)
          .then(res => {
            this.$notify.deleteOk()
            this.datas.splice(index, 1)
            this.editRow = null
            this.listLoading = false
          })
          .catch(() => {
            this.listLoading = false
          })
      })
    },
    onClickCell(row, column, cell, event) {
      if (column.label.indexOf('目录') === 0 || column.label === '产品型号') {
        this.editRow = row
      }
    }
  }
}
</script>

<style scoped>
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
</style>
