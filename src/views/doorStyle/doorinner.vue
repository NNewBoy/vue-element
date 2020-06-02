<template>
  <div ref="list_body" class="app-container">
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
      :multi-choices="[true,true,false]"
      @getResult="getResult2"
    />
    <div class="div1">
      <li><el-input v-model="searchText" size="mini" prefix-icon="el-icon-search" clearable placeholder="查找" /></li>
      <li><el-button type="primary" size="mini" icon="el-icon-search" @click="btnSearch" /></li>
      <li><el-button type="primary" icon="el-icon-plus" size="mini" @click="btnAddData">新增</el-button></li>
      <li><el-button type="primary" icon="el-icon-document" size="mini" @click="btnSaveData">保存</el-button></li>
      <li><el-button type="primary" icon="el-icon-refresh" size="mini" @click="btnReset">重置</el-button></li>
      <li><upload-excel action="/doorinner/import" :on-success="onExcelSuccess" :visible="true" /></li>
      <li><el-button v-show="selRow" type="primary" size="mini" @click="btnCancel">取消选择</el-button></li>
    </div>
    <el-table
      id="table1"
      ref="table1"
      v-loading="listLoading"
      :data="doorstyleListFilter"
      :row-style="rowStyle"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @row-contextmenu="rowContextmenu"
      @row-click="onRowClick"
      @cell-click="onCellClick"
    >
      <el-table-column align="center" label="ID" width="50">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="门板颜色" width="120">
        <template slot-scope="{row}">
          <input v-model="row.door_color" type="text" @input="onInput(row)" @keyup.enter="onSubmit">
          <span>{{ row.door_color }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="门板类型" width="100">
        <template slot-scope="{row}">
          <input v-model="row.door_type" type="text" @input="onInput(row)" @keyup.enter="onSubmit">
          <span>{{ row.door_type | DoorType }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="编号" width="100" :render-header="renderHeaderNo">
        <template slot-scope="{row}">
          <input v-model="row.inner_zone_no" type="text" @input="onInput(row)" @keyup.enter="onSubmit">
          <span>{{ row.inner_zone_no }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="图片" width="150" :render-header="renderHeaderPic">
        <template slot-scope="{row}">
          <upload-pic
            :id="row.id"
            :pic="row.inner_zone_pic?`kitdat/doorinner/${row.inner_zone_pic}`:''"
            :width="130"
            :height="130"
            :enable-upload="canUploadPic(row)"
            action="/api/doorinner/uploadpic"
            :on-success="onUploadPicSuccess.bind(null, row)"
          />
          <input v-model="row.inner_zone_pic" type="text" @input="onInput(row)" @keyup.enter="onSubmit">
          <span>{{ row.inner_zone_pic }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="默认材料" width="100">
        <template slot-scope="{row}">
          <div @click="onSetDefaultDoorInner(row)">
            <el-image :src="getPicUrl(row.default_material)" class="pic" :lazy="true" :title="defMatTitle(row)" />
            <span>{{ row.default_material ? row.default_material.name : "未选择" }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="可选材料" width="320">
        <template slot-scope="{row}">
          <multi-mat-list :data="row.inner_mat" :on-change="onMatListChange.bind(null, row)" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="门芯类型" width="100">
        <template slot-scope="{row}">
          <input v-model="row.inner_type" type="text" @input="onInput(row)" @keyup.enter="onSubmit">
          <span>{{ row.inner_type }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="ShapeCode" width="100">
        <template slot-scope="{row}">
          <input v-model="row.inner_door_shape_code" type="text" @input="onInput(row)" @keyup.enter="onSubmit">
          <span>{{ row.inner_door_shape_code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="80"> <!--  最后一列自动后弹 -->
        <template slot-scope="{row,$index}">
          <!-- <el-button
            type="primary"
            size="mini"
            icon="el-icon-check"
            @click="onSave(row,$index)"
          /> -->
          <el-button
            v-if="row.status!='deleted'"
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="onDelete(row,$index)"
          />
        </template>
      </el-table-column>

      <brand-column />
      <sku-status-column />

    </el-table>

    <context-menu ref="contextmenu" :items="doorInnerContextMenu" @click="onClickDoorInnerMenu" />

    <el-dialog title="选择默认门芯" :visible.sync="dialogFormVisible" width="90%" height="90%" style="z-index:999999" :center="false">
      <div class="select-door-inner">
        <single-material-select
          :refresh="dialogFormVisible"
          :fetch-catalog="fetchInnerCatalog"
          :fetch-material="fetchInnerMaterial"
          :init-selected="initSelectedDoorInner"
          @select="selectedDoorInner"
          @close="onCancelDoorInner"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCatalogByDoorInner, getMatByDoorInner } from '@/api/material'
import { getInnerCatalog, getDoorInnerList, updateDoorInner, deleteDoorInner } from '@/api/doorstyle'/** , addDoorInner */
import MultiFilter from '@/components/MultiFilter'
import { editDelete, confirmEdit } from '@/utils/edit'
import MultiMatList from '@/components/MultiMatList'
import BrandColumn from '@/components/BrandColumn'
import SkuStatusColumn from '@/components/SkuStatusColumn'
import UploadExcel from '@/components/UploadExcel'
import SingleMaterialSelect from '@/components/SingleMaterialSelect'
import { getThumbnailUrl } from '@/utils/pic'
import UploadPic from '@/components/UploadPic'
import ContextMenu from '@/components/ContextMenu'
import toPinyin from '@/utils/chineseToPinyin'

export default {
  components: { MultiFilter, MultiMatList, BrandColumn, SkuStatusColumn, UploadExcel, SingleMaterialSelect, UploadPic, ContextMenu },
  filters: {
    DoorType: function(value) {
      switch (value) {
        case 'A':
          return '通用面板'
        case 'B':
          return '玻璃门'
        case 'C':
          return '抽屉面板'
        default:
          return value
      }
    }
  },
  data() {
    return {
      listLoading: false,
      catalogs: [],
      doorstyleList: [],
      selectArr: [],
      searchTarget: 'door_color', // 搜索字段
      // 默认门芯设置
      dialogFormVisible: false,
      currentDoorInner: null,
      searchText: '',
      selRow: false,
      doorInnerContextMenu: [{ name: '复制添加' }]
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
    },
    defMatTitle() {
      return function(inner) {
        return inner.default_material ? (inner.default_material.use_group + '\\' + inner.default_material.texture_group) : ''
      }
    },
    initSelectedDoorInner() { // 选门芯时默认选中的材料
      if (this.currentDoorInner && this.currentDoorInner.default_material) {
        return this.currentDoorInner.default_material.use_group + '\\' + this.currentDoorInner.default_material.texture_group + '\\' + this.currentDoorInner.default_material.name
      }
      return ''
    },
    canUploadPic() {
      return function(inner) {
        if (inner.inner_zone_pic && inner.inner_zone_pic.length > 4 && !inner.changed) {
          return true
        } else {
          return false
        }
        // return inner.inner_zone_pic && inner.inner_zone_pic.length > 4 && !inner.changed
      }
    },
    doorstyleListFilter: function() {
      return this.doorstyleList.filter(el => {
        const txt = el[this.searchTarget]
        const st = this.searchText.toUpperCase()
        return txt.toUpperCase().indexOf(st) >= 0 ||
          toPinyin.getFirstLetter(txt).indexOf(st) >= 0 ||
          toPinyin.chineseToPinYin(txt).toUpperCase().indexOf(st) >= 0
      })
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const { data } = await getInnerCatalog()
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
    renderHeaderNo(h, { column, $index }) {
      return h('span', {}, [
        h('span', {}, '编号'),
        h('el-popover', { props: { placement: 'top-start', width: '250', trigger: 'hover', content: '门芯区域号(从1开始，必须连续)' }}, [
          h('i', { slot: 'reference', class: 'el-icon-question' }, '')
        ])
      ])
    },
    renderHeaderPic(h, { column, $index }) {
      return h('span', {}, [
        h('span', {}, '图片'),
        h('el-popover', { props: { placement: 'top-start', width: '250', trigger: 'hover', content: '修改后先保存才能上传' }}, [
          h('i', { slot: 'reference', class: 'el-icon-question' }, '')
        ])
      ])
    },
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
        this.restSelectArr = []
      }
    },
    async fetchDoorColor() {
      this.listLoading = true
      const { data } = await getDoorInnerList(this.allDoorStyle)
      data.forEach(ele => { ele.changed = false })
      this.doorstyleList = data
      this.listLoading = false
    },
    getParams(params) {
      // updateDoorStyle(params).then(() => {
      //   for (const item of params) {
      //     const index = this.doorstyleList.findIndex(v => v.id === item.id)
      //     for (const val in item) {
      //       if (val !== 'id') { this.doorstyleList[index][val] = item[val] }
      //     }
      //   }
      //   this.$message.editOk()
      // }).catch(() => {
      //   this.$notify.editError()
      // })
    },
    onDelete(row, index) {
      editDelete(() => {
        if (row.id) {
          this.listLoading = true
          deleteDoorInner(row.id)
            .then(response => {
              this.$notify.deleteOk()
              this.doorstyleList.splice(index, 1)
              this.listLoading = false
            })
            .catch(() => {
              this.listLoading = false
            })
        } else {
          this.doorstyleList.splice(index, 1)
        }
      })
    },
    onExcelSuccess({ results, header }) {
      this.fetchData()
    },
    getPicUrl(data) {
      return data ? getThumbnailUrl(data.pic_file_name) : ''
    },
    onSetDefaultDoorInner(inner) {
      this.currentDoorInner = inner
      this.dialogFormVisible = true
    },
    async fetchInnerCatalog(brand) {
      return await getCatalogByDoorInner(brand, this.currentDoorInner.id, true)
    },
    async fetchInnerMaterial(brand, dir1, dir2) {
      return await getMatByDoorInner(brand, this.currentDoorInner.id, dir1, dir2, true)
    },
    onCancelDoorInner() {
      this.dialogFormVisible = false
      this.currentDoorInner = null
    },
    selectedDoorInner(mat) {
      this.currentDoorInner.default_mat_id = mat.id
      this.currentDoorInner.default_material = mat
      this.currentDoorInner.changed = true
      this.onCancelDoorInner()
    },
    btnAddData() {
      this.listLoading = true
      this.selRow = true
      const data = { changed: true, door_color: '' }
      this.doorstyleList.unshift(data)
      this.$refs.table1.setCurrentRow(this.doorstyleList[0])
      this.listLoading = false
    },
    // onSave(row, index) {
    //   confirmEdit(() => {
    //     this.listLoading = true
    //     updateDoorInner(row)
    //       .then(response => {
    //         this.$message.editOk()
    //         this.listLoading = false
    //       })
    //       .catch(() => {
    //         this.listLoading = false
    //       })
    //   })
    // },
    btnSaveData(row, index) {
      const editedArr = this.doorstyleList.filter(item => item.changed)
      if (editedArr.length > 0) {
        confirmEdit(() => {
          this.listLoading = true
          updateDoorInner(editedArr)
            .then(response => {
              this.listLoading = false
              this.$message.editOk()
              this.fetchData()
              this.selRow = false
            })
            .catch(() => {
              this.listLoading = false
              this.$notify.editError()
            })
        })
      }
    },
    btnCancel() {
      this.$refs.table1.setCurrentRow()
      this.selRow = false
    },
    onRowClick() {
      this.selRow = true
    },
    onCellClick(row, column, cell, event) {
      this.$nextTick(() => {
        const input = cell.querySelector('input')
        if (input) {
          input.focus()
        }
      })
    },
    rowStyle({ row, rowIndex }) {
      return row.changed ? { 'background-color': 'PeachPuff' } : ''
    },
    onInput(row) {
      row.changed = true
    },
    onSubmit() {
      this.$refs.table1.setCurrentRow()
    },
    btnReset() {
      this.searchText = ''
      this.fetchData()
    },
    btnSearch() {
      this.$message.error('Search ...')
    },
    onUploadPicSuccess(row, res, file) {
      if (res.success) {
        const tmp = row.inner_zone_pic
        row.inner_zone_pic = null
        row.inner_zone_pic = tmp
        this.$notify.uploadOk()
      } else {
        this.$notify.uploadError()
      }
      this.onSubmit()
    },
    onMatListChange(row) {
      row.changed = true
    },
    rowContextmenu(row, column, event) {
      // 阻止右键默认行为
      event.preventDefault()
      // this.$nextTick(() => {
      this.$refs.contextmenu.show(event, row)
      // })
    },
    onClickDoorInnerMenu(data, item) {
      const idx = this.doorstyleList.findIndex(el => el.id === data.id)
      if (idx >= 0 && item.name === '复制添加') {
        const newRow = {}
        Object.assign(newRow, this.doorstyleList[idx])
        newRow.id = null
        newRow.changed = true
        newRow.inner_zone_no++
        this.doorstyleList.splice(idx + 1, 0, newRow)
      }
    }
  }
}
</script>

<style scoped>
    .div1{
      height: 50px;
      line-height: 50px;
    }
  li{
    margin-right: 20px;
    list-style-type: none;
    float: left;
  }
  #table1 input {
    font-size: 12px;
		display: block;
    width: 100%;
    height: 28px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin: 3px 0;
    padding: 6px 2px;
    transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
    display: none;
	}
  #table1 input:focus {
    border-color: #66afe9;
    box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6);
    outline: 0px;
  }
  #table1 .current-row input {
    display: block
  }
  #table1 .current-row input+span {
    display: none
  }
  .pic {
    width: 80px;
    height: 80px;
    display: block;
  }
  .select-door-inner {
    display: block;
    width: 80%;
    height: 600px;
    background-color: #ffffff;
  }
</style>
