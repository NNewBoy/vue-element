<template>
  <div class="app-container">
    原物体
    <el-autocomplete
      v-model="newItem.obj_name"
      :fetch-suggestions="querySearchMethod"
      placeholder="原物体"
    >
      <template slot-scope="{ item }">
        <div class="name">{{ item.value }}</div>
      </template>
    </el-autocomplete>
    &nbsp;&nbsp;&nbsp;&nbsp;跟随物体
    <el-autocomplete
      v-model="newItem.main_obj_name"
      :fetch-suggestions="querySearchMethod"
      placeholder="跟随物体"
    >
      <template slot-scope="{ item }">
        <div class="name">{{ item.value }}</div>
      </template>
    </el-autocomplete>
    &nbsp;&nbsp;
    <el-button
      v-waves
      size="small"
      type="success"
      icon="el-icon-plus"
      :disabled="!enableAdd"
      @click="handleAdd()"
    >
      添加
    </el-button>
    <br>
    <br>

    <el-table
      v-loading="listLoading"
      :data="datas"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="50">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="原物体" width="200">
        <template slot-scope="{row}">
          {{ row.obj_name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="跟随物体" width="200">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-autocomplete
              v-model="row.main_obj_name"
              :fetch-suggestions="querySearchMethod"
              placeholder="原物体"
            >
              <template slot-scope="{ item }">
                <div class="name">{{ item.value }}</div>
              </template>
            </el-autocomplete>
          </template>
          <span v-else>{{ row.main_obj_name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="启用" width="80">
        <template slot-scope="{row}">
          <el-checkbox v-model="row.enable" @change="enableItem(row.obj_name, row.enable)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="mini-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-dropdown
            v-if="row.edit"
            size="mini"
            @command="dropdownCmd"
          >
            <el-button
              v-waves
              type="success"
              size="mini"
              icon="el-icon-circle-check-outline"
              :disabled="!canEdit(row)"
              @click="handleEdit(row)"
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
            v-waves
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="row.edit=!row.edit"
          >
            修改
          </el-button>
          <el-button
            v-if="row.status!='deleted'"
            v-waves
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(row,$index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getSetCtrl, enableSetCtrl, deleteSetCtrl, addSetCtrl, editSetCtrl } from '@/api/material'
import { editDelete } from '@/utils/edit'
import waves from '@/directive/waves'

export default {
  directives: { waves },
  data() {
    return {
      listLoading: false,
      datas: [],
      objNameList: ['WORKTOP', 'WATERPROOF', 'WORKTOPEDGE', 'WORKTOPCUSHION', 'WALLBRKPANEL', 'PLINTH', 'CORNICE', 'LIGHTSCR', 'DOORCOVER', 'TOPPANEL', 'TOPCOVER',
        'DRAWERBODY', 'BACKPANEL', 'SHELFPANEL', 'UNITBODY', 'UNITLIGHT', 'UNITEDGE', 'UNITFRONTEDGE', 'FLOOR', 'WALL', 'HANDLE', 'SUPPORTFRAME', 'SIDEDECOBOARD',
        'BATHHOLDER', 'WASHWORKTOP', 'CONCRETEFRAME', 'ALLLIGHT_UNITEDGE', 'CEILING', 'SCENEDOOR', 'PIPEWRAP', 'CABINETDOOR', 'CLASSICBOARD', 'METALBAR', 'STEPFRAMECOLUMN',
        'CHANDLE', 'PEDESTAL', 'PEDESTALEDGE'],
      newItem: { obj_name: '', main_obj_name: '' }
    }
  },
  computed: {
    enableAdd: function() {
      if (this.newItem.obj_name.length <= 2 || this.newItem.main_obj_name.length <= 2) {
        return false
      }
      return !(this.datas.find((item) => item.obj_name === this.newItem.obj_name)) && this.newItem.obj_name !== this.newItem.main_obj_name
    },
    canEdit: function() {
      return function(row) {
        return row.obj_name !== row.main_obj_name
      }
    }
  },
  created() {
    this.fetchData()
    this.objNameList.sort()
  },
  methods: {
    async fetchData() {
      this.listLoading = true
      const { data } = await getSetCtrl()
      this.datas = data.map(item => {
        this.$set(item, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
        item.enable = (item.enable === 1)
        item.org_main_obj_name = item.main_obj_name
        item.edit = false
        return item
      })
      this.listLoading = false
    },
    enableItem(name, enable) {
      this.listLoading = true
      enableSetCtrl(name, enable ? 1 : 0).then(response => {
        this.$notify({
          title: 'Success',
          message: (enable ? '启用成功' : '禁用成功'),
          type: 'success',
          duration: 2000
        })
        this.listLoading = false
      })
    },
    handleDelete(row, index) {
      editDelete(() => {
        this.listLoading = true
        deleteSetCtrl(row.obj_name).then(response => {
          this.$notify.deleteOk()
          this.datas.splice(index, 1)
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      })
    },
    handleAdd() {
      this.listLoading = true
      this.newItem.obj_name = this.newItem.obj_name.toUpperCase()
      this.newItem.main_obj_name = this.newItem.main_obj_name.toUpperCase()
      addSetCtrl(this.newItem.obj_name, this.newItem.main_obj_name).then(response => {
        this.$notify.addOk()

        // 可考虑重新拿数据
        // this.fetchData()
        const n = { obj_name: this.newItem.obj_name, main_obj_name: this.newItem.main_obj_name, enable: true }
        this.$set(n, 'edit', false)
        this.datas.push(n)

        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleEdit(row) {
      this.listLoading = true
      row.main_obj_name = row.main_obj_name.toUpperCase()
      editSetCtrl(row.obj_name, row.main_obj_name).then(response => {
        this.listLoading = false
        this.$message.editOk()
        row.org_main_obj_name = row.main_obj_name
        row.edit = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    dropdownCmd(param) {
      if (param.button === 'cancel') {
        param.row.main_obj_name = param.row.org_main_obj_name
        param.row.edit = false
      }
    },
    beforeCommand(item, row) {
      return {
        'button': item,
        'row': row
      }
    },
    querySearchMethod(queryString, cb) {
      const that = this
      var solList = []
      that.objNameList.forEach(item => {
        solList.push({ 'label': item, 'value': item })
      })

      const results = queryString ? solList.filter((item) => {
        const tmp = queryString.toLowerCase()
        return item.label.toLowerCase().indexOf(tmp) >= 0
      }) : solList
      // 调用 callback 返回建议列表的数据
      cb(results)
    }
  }
}
</script>

<style scoped>
.active{
		float: left;
		margin-left: 10px;
		padding: 10px;
		background: #6e99e7;
		margin-bottom: 10px;
		border-radius: 4px;
		font-size: 14px;
	}
.Classification {
		float: left;
		margin-left: 10px;
		padding: 10px;
		background: #f7f7f7;
		margin-bottom: 10px;
		border-radius: 4px;
		font-size: 14px;
	}
</style>
