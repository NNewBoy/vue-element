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
      :multi-choices="[false,false,false]"
      @getResult="getResult2"
    />
    <StatusFilter @selectStatus="selectStatus" />
    <BrandsFilter @selectBrands="selectBrands" />
    <br>
    <div class="menu-list">
      <div class="menu-item">
        <el-input
          v-model="searchText"
          clearable
          size="small"
          placeholder="查找"
          prefix-icon="el-icon-search"
        />
      </div>

      <div class="menu-item">
        <upload-excel class="excel-item" :btn-margin="false" btn-size="small" action="/doorstyle/import" :on-success="onExcelSuccess" />
        <el-button class="excel-item" type="primary" size="small" @click="editCatalogName">编辑目录名</el-button>

        <el-dropdown size="small" split-button type="primary" @click="selectMaterial" @command="command=>radioVal=command">
          {{ radioVal | dropFilter }}
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="">更多功能</el-dropdown-item>
            <el-dropdown-item command="material">材质参数</el-dropdown-item>
            <el-dropdown-item command="catalog">移动目录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <div class="menu-item radio-menu">
        <el-button-group class="brand-button">
          <el-button type="success" size="small" @click="saveProperty">保存</el-button>
          <el-button type="warning" size="small" @click="resetProperty">重置</el-button>
          <el-button v-show="openBtn" type="primary" size="small" @click="addProperty">添加</el-button>
          <el-button v-show="openBtn" type="primary" size="small" @click="copyProperty">复制</el-button>
          <el-button v-show="openBtn" type="primary" size="small" @click="pasteProperty">粘贴</el-button>
          <el-button v-show="openBtn" type="primary" size="small" @click="pasteAndAddProperty">添加并粘贴</el-button>
          <el-button type="primary" size="small" :icon="openBtn?'el-icon-arrow-left':'el-icon-arrow-right'" @click="openBtn = !openBtn" />
        </el-button-group>
      </div>
    </div>
    <br>
    <el-table
      ref="tbTable"
      v-loading="loadingDoorColor"
      max-height="500px"
      :data="tableDataFilter"
      :row-style="tableRowStyle"
      element-loading-text="Loading"
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
      <el-table-column align="center" label="ID" width="40">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="图片" width="80">
        <template slot-scope="{row}">
          <el-upload
            class="hotadv-uploader"
            action="/api/mat/uploadpic"
            :data="{'token':token, 'mid': row.id}"
            :show-file-list="false"
            :on-success="onUploadPicSuccess.bind(null, row)"
            :before-upload="beforePicUpload"
          >
            <el-image v-if="row.preview_pic" :src="getPicUrl(row.preview_pic)" class="avatar" :lazy="true" />
            <i v-else class="el-icon-plus hotadv-uploader-icon" />
          </el-upload>
        </template>
      </el-table-column>

      <CommonColumn label="颜色" min-width="200" value="door_color" />

      <el-table-column align="center" label="door" width="80">
        <template slot-scope="{row}">
          <el-upload
            class="hotadv-uploader"
            action="/api/mat/uploadpic"
            :data="{'token':token, 'mid': row.id}"
            :show-file-list="false"
            :on-success="onUploadPicSuccess.bind(null, row)"
            :before-upload="beforePicUpload"
          >
            <el-image v-if="row.preview_pic" :src="getDoorPicUrl(row.folder)" class="avatar" :lazy="true" />
            <i v-else class="el-icon-plus hotadv-uploader-icon" />
          </el-upload>
        </template>
      </el-table-column>
      <el-table-column align="center" label="drawer" width="80">
        <template slot-scope="{row}">
          <el-upload
            class="hotadv-uploader"
            action="/api/mat/uploadpic"
            :data="{'token':token, 'mid': row.id}"
            :show-file-list="false"
            :on-success="onUploadPicSuccess.bind(null, row)"
            :before-upload="beforePicUpload"
          >
            <el-image v-if="row.preview_pic" :src="getDrawerPicUrl(row.folder)" class="avatar" :lazy="true" />
            <i v-else class="el-icon-plus hotadv-uploader-icon" />
          </el-upload>
        </template>
      </el-table-column>
      <el-table-column align="center" label="ShapeCode" width="100">
        <template slot-scope="{row}">
          <router-link :to="`/doorstyle/doorshape?code=${row.door_shape_code}`">
            {{ row.door_shape_code }}
          </router-link>
        </template>
      </el-table-column>

      <CommonColumn label="目录" width="200" value="folder" />

      <el-table-column align="center" label="厚度" width="50">
        <template slot-scope="{row}">
          {{ row.door_thick }}
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

      <sku-status-column />

      <brand-column />

      <PicDirColumn />

      <div v-if="radioVal==='material'">
        <MaterialColumn />
      </div>

    </el-table>

    <MaterialDialog
      :dialog-visible="materialDialogVisible"
      :material-checkbox-val="selection"
      :table-data="tableDataFilter"
      :search-target="searchTarget"
      @closeDialog="closeDialog('material')"
      @returnMaterial="getMaterial"
    />
    <CatalogDialog
      :catalog-dialog-visible="catalogDialogVisible"
      :material-checkbox-val="selection"
      :table-data="tableDataFilter"
      :from-catalog="nowCatalog"
      :cascader-datas="catalogs"
      :search-target="searchTarget"
      @closeCatalogDialog="closeDialog('catalog')"
      @returnCatalog="changeCatalog"
    />
    <CatalogNameDialog
      :catalog-name-dialog-visible="catalogNameDialogVisible"
      :cascader-datas="catalogs"
      :search-target="searchTarget"
      @closeDialog="closeDialog('catalogName')"
      @returnCatalogName="changeCatalogName"
    />
  </div>
</template>

<script>
import { getCatalog, getColorList, updateDoorStyle, deleteDoorStyle } from '@/api/doorstyle'
import { getThumbnailUrl, checkPicBeforeUpload } from '@/utils/pic'
import { getToken } from '@/utils/auth'
import { editDelete } from '@/utils/edit'
import { confirmEdit } from '@/utils/edit'
import MultiFilter from '@/components/MultiFilter'
import CommonColumn from '@/components/MaterialEdit/column/CommonColumn'
import SkuStatusColumn from '@/components/SkuStatusColumn2'
import BrandColumn from '@/components/BrandColumn'
import PicDirColumn from '@/components/MaterialEdit/column/PicDirColumn'
import BrandsFilter from '@/components/MaterialEdit/filter/BrandsFilter'
import StatusFilter from '@/components/MaterialEdit/filter/StatusFilter'
import MaterialColumn from '@/components/MaterialEdit/column/MaterialColumn'
import MaterialDialog from '@/components/MaterialEdit/dialog/MaterialDialog'
import CatalogDialog from '@/components/MaterialEdit/dialog/CatalogDialog'
import CatalogNameDialog from '@/components/MaterialEdit/dialog/CatalogNameDialog'
import toPinyin from '@/utils/chineseToPinyin'
import UploadExcel from '@/components/UploadExcel'
import { copyToClipboard, pasteFromClipboard } from '@/utils/clipboard'

export default {
  components: { MultiFilter, BrandsFilter, StatusFilter, CommonColumn, SkuStatusColumn, BrandColumn, PicDirColumn, MaterialColumn, MaterialDialog, CatalogDialog, CatalogNameDialog, UploadExcel },
  filters: {
    dropFilter: function(val) {
      switch (val) {
        case 'material':
          return '材质参数'
        case 'catalog':
          return '移动目录'
        default:
          return '更多功能'
      }
    }
  },
  data() {
    return {
      loadingDoorColor: false,
      token: getToken(),
      doorstyleList: [],
      catalogs: [],
      nowCatalog: [],
      selectArr: [],
      restSelectArr: [],
      searchTarget: 'door_color',
      searchText: '',
      radioVal: '', // 选择材料参数
      materialDialogVisible: false,
      catalogDialogVisible: false,
      catalogNameDialogVisible: false,
      selection: [],
      selectStatusRes: {}, // 上架状态筛选器的返回值
      selectBrandsRes: {}, // 品牌筛选器的返回值
      ifUpdate: false, // 判断是否刷新数据
      openBtn: false // 编辑按钮打开与否
    }
  },
  computed: {
    doorStyle() {
      if (this.selectArr.length > 0) {
        return this.selectArr[0].map(item => item.name).join('\\')
      } else {
        return '\\\\\\'
      }
    },
    restDoorStyle() {
      if (this.restSelectArr.length > 0) {
        return this.restSelectArr[0].map(item => item.name).join('\\')
      } else {
        return '\\\\\\'
      }
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
    tableDataFilter: function() {
      return this.doorstyleList.filter(el => {
        const txt = el[this.searchTarget]
        const st = this.searchText.toUpperCase()
        return txt.toUpperCase().indexOf(st) >= 0 ||
          toPinyin.getFirstLetter(txt).indexOf(st) >= 0 ||
          toPinyin.chineseToPinYin(txt).toUpperCase().indexOf(st) >= 0
      })
    }
  },
  watch: {
    radioVal(val) {
      this.$refs.tbTable.doLayout()
    },
    ifUpdate(val) { // 根据selectStatusRes和selectBrandsRes判断是否刷新数据
      if (val) { // 上架状态筛选
        this.searchText = ''
        if (Object.keys(this.selectStatusRes).length > 0) {
          if (this.selectStatusRes.all) {
            this.fetchDoorColor().then(() => {
              this.brandsFilterFunc()
            })
          } else if (this.selectStatusRes.check.length > 0) {
            this.fetchDoorColor().then(() => {
              const temp = []
              for (const item of this.doorstyleList) {
                for (const i of this.selectStatusRes.check) {
                  if (item.status === i) {
                    temp.push(item)
                    break
                  }
                }
              }
              this.doorstyleList = JSON.parse(JSON.stringify(temp))
            }).then(() => {
              this.brandsFilterFunc()
            })
          } else if (this.selectStatusRes.check.length === 0) {
            this.doorstyleList = []
          }
        }

        this.ifUpdate = false
        this.$refs.tbTable.doLayout()
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    onClickTb(row, column, cell, event) { // 表格聚焦
      this.$nextTick(() => {
        const input = cell.querySelector('input')
        if (input) {
          input.focus()
        }
      })
    },
    selectStatus(res) {
      this.selectStatusRes = res
      this.ifUpdate = true
    },
    selectBrands(res) {
      this.selectBrandsRes = res
      this.ifUpdate = true
    },
    brandsFilterFunc() { // 品牌筛选
      if (Object.keys(this.selectBrandsRes).length > 0) {
        if (!this.selectBrandsRes.all) {
          if (this.selectBrandsRes.check.length > 0) {
            const temp = []
            for (const item of this.doorstyleList) {
              for (const i of this.selectBrandsRes.check) {
                if (item.spzp === 1 && i === 'spzp') {
                  temp.push(item)
                  break
                }
                if (item.wayes === 1 && i === 'wayes') {
                  temp.push(item)
                  break
                }
                if (item.homkoo === 1 && i === 'homkoo') {
                  temp.push(item)
                  break
                }
              }
            }
            this.doorstyleList = JSON.parse(JSON.stringify(temp))
          } else if (this.selectBrandsRes.check.length === 0) {
            this.doorstyleList = []
          }
        }
      }
    },
    tableRowStyle({ row, rowIndex }) {
      return row.editStatus === 1 ? { 'background-color': 'PeachPuff' } : ''
    },
    closeDialog(target) {
      if (target === 'material') {
        this.materialDialogVisible = false
      } else if (target === 'catalog') {
        this.catalogDialogVisible = false
      } else if (target === 'catalogName') {
        this.catalogNameDialogVisible = false
      }
      this.$refs.tbTable.clearSelection() // 清空选项
    },
    selectMaterial() {
      if (this.radioVal === '') {
        this.$confirm('未选择编辑功能', '警告', {
          showCancelButton: false,
          confirmButtonText: '确认',
          type: 'warning'
        }).catch(() => {})
      } else {
        if (this.selection.length > 0) {
          if (this.radioVal === 'material') {
            this.materialDialogVisible = true
          } else if (this.radioVal === 'catalog') {
            this.catalogDialogVisible = true
          }
        } else {
          this.$confirm('未选择材质', '警告', {
            showCancelButton: false,
            confirmButtonText: '确认',
            type: 'warning'
          }).catch(() => {})
        }
      }
    },
    handleSelectionChange(selection) {
      this.selection = selection
    },
    saveProperty() {
      const editedArr = this.doorstyleList.filter(item => item.editStatus === 1)
      if (editedArr.length > 0) {
        confirmEdit(() => {
          this.loadingDoorColor = true
          updateDoorStyle(editedArr)
            .then(response => {
              this.loadingDoorColor = false
              this.$message.editOk()
              this.fetchDoorColor()
            })
            .catch(() => {
              this.loadingDoorColor = false
              this.$notify.editError()
            })
        })
      }
    },
    resetProperty() {
      this.searchText = ''
      this.fetchDoorColor()
    },
    addProperty() {
      const tempData = {
        id: null,
        door_series: this.nowCatalog[0],
        door_price: this.nowCatalog[1],
        door_shape: this.nowCatalog[2],
        door_ext4: this.restSelectArr[0][0].name ? this.restSelectArr[0][0].name : '',
        door_ext5: this.restSelectArr[0][1].name ? this.restSelectArr[0][1].name : '',
        door_ext6: this.restSelectArr[0][2].name ? this.restSelectArr[0][2].name : '',
        door_color: '',
        preview_pic: '',
        door_shape_code: 'door_000',
        folder: '',
        door_thick: '18',
        status: 0, spzp: 1, wayes: 1, homkoo: 1,
        pic_file_texture_dir: null,
        editStatus: 1
      }
      this.doorstyleList.unshift(tempData)
    },
    copyProperty() {
      if (this.selection.length > 0) {
        const temp = JSON.parse(JSON.stringify(this.selection))
        temp.forEach(el => {
          el.id = null
        })
        copyToClipboard('door_style_index', temp)
      } else {
        this.$confirm('未选择材质', '警告', {
          showCancelButton: false,
          confirmButtonText: '确认',
          type: 'warning'
        }).catch(() => {

        })
      }
    },
    pasteProperty() {
      if (this.selection.length > 0) {
        const data = pasteFromClipboard('door_style_index')
        if (data) {
          const length = data.length
          const selectedLength = this.selection.length
          if (length !== selectedLength) {
            this.$confirm(
              `已复制${length}条，可粘贴${selectedLength}条，是否只粘贴前${length >= selectedLength ? selectedLength : length}条`,
              '复制数量与粘贴数量不一致', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
              if (length > selectedLength) { // 选择多于已复制，粘贴所有已复制
                for (const index in this.selection) {
                  for (const item in data[index]) {
                    if (item !== 'id') { this.selection[index][item] = data[index][item] }
                  }
                  this.selection[index].editStatus = 1
                }
              } else if (length < selectedLength) { // 选择数x少于已复制数y，粘贴数据为已复制数据的前x条
                for (const index in data) {
                  for (const item in data[index]) {
                    if (item !== 'id') { this.selection[index][item] = data[index][item] }
                  }
                  this.selection[index].editStatus = 1
                }
              }
            }).catch(() => {})
          } else {
            for (const index in data) {
              for (const item in data[index]) {
                if (item !== 'id') { this.selection[index][item] = data[index][item] }
              }
              this.selection[index].editStatus = 1
            }
          }
        }
      } else {
        this.$confirm('未选择材质', '警告', {
          showCancelButton: false,
          confirmButtonText: '确认',
          type: 'warning'
        }).catch(() => {})
      }
    },
    pasteAndAddProperty() {
      const data = pasteFromClipboard('door_style_index')
      if (data) {
        data.map(item => {
          item.editStatus = 1
        })
        this.doorstyleList.unshift(...data)
      }
    },
    editCatalogName() { // 显示修改目录名对话框前的判断，需先保存修改的数据
      const editedArr = this.doorstyleList.filter(item => item.editStatus === 1)
      if (editedArr.length > 0) {
        this.$confirm('有未保存的修改,点击确定保存', '警告', {
          showCancelButton: false,
          confirmButtonText: '确认',
          type: 'warning'
        }).then(() => {
          this.saveProperty()
        }).catch(() => {

        })
      } else {
        this.catalogNameDialogVisible = true
      }
    },
    changeCatalogName(catalog) { // 改变目录名称
      this.loadingDoorColor = true
      // updateDoorStyle(params).then(() => {
      console.log(catalog.origin) // 目标目录
      console.log(catalog.change) // 改变后的目录
      this.loadingDoorColor = false
      this.$message.editOk()
      this.fetchData() // 重新加载目录
      // }).catch(() => {
      //   this.loadingDoorColor = false
      //   this.$notify.editError()
      // })
    },
    changeCatalog(catalog) { // 移动目录
      confirmEdit(() => {
        for (const item of catalog.id) {
          const index = this.doorstyleList.findIndex(v => v.id === item)
          this.doorstyleList[index].editStatus = 1
          this.doorstyleList[index].door_series = catalog.to[0]
          this.doorstyleList[index].door_price = catalog.to[1]
          this.doorstyleList[index].door_shape = catalog.to[2]
          this.$refs.tbTable.doLayout()
        }
        const editedArr = this.doorstyleList.filter(item => item.editStatus === 1)
        this.loadingDoorColor = true
        updateDoorStyle(editedArr)
          .then(response => {
            this.loadingDoorColor = false
            this.$message.editOk()
            this.fetchDoorColor()
          })
          .catch(() => {
            this.loadingDoorColor = false
            this.$notify.editError()
          })
      })
      this.$refs.tbTable.clearSelection() // 清空选项
    },
    getMaterial(material) { // 材质参数
      for (const item of material) {
        const index = this.doorstyleList.findIndex(v => v.id === item.id)
        this.doorstyleList[index].editStatus = 1
        for (const val in item) {
          if (val !== 'id') { this.doorstyleList[index][val] = item[val] }
        }
        this.$refs.tbTable.doLayout()
      }
      this.$refs.tbTable.clearSelection() // 清空选项
    },
    getResult(arr) {
      if (arr.length > 0) {
        this.selectArr = arr
        this.nowCatalog = this.selectArr[0].map(item => item.name)
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
      if (this.selectArr.length > 0) {
        this.loadingDoorColor = true
        const { data } = await getColorList(this.allDoorStyle)
        this.doorstyleList = data
        this.loadingDoorColor = false
      }
    },
    getPicUrl(pic) {
      return getThumbnailUrl(pic) // + '?' + Math.random()
    },
    getDoorPicUrl(folder) {
      return getThumbnailUrl(folder + 'door_800x800.jpg') // + '?' + Math.random()
    },
    getDrawerPicUrl(folder) {
      return getThumbnailUrl(folder + 'drawer_800x800.jpg') // + '?' + Math.random()
    },
    beforePicUpload(file) {
      return checkPicBeforeUpload(file)
    },
    onUploadPicSuccess(row, res, file) {
      if (res.success) {
        const tmp = row.preview_pic
        row.preview_pic = null
        row.preview_pic = tmp
        this.$notify.uploadOk()
      } else {
        this.$notify.uploadError()
      }
    },
    onDelete(row, index) {
      editDelete(() => {
        this.loadingDoorColor = true
        deleteDoorStyle(row.id).then(response => {
          this.$notify.deleteOk()
          this.doorstyleList.splice(index, 1)

          this.loadingDoorColor = false
        }).catch(() => {
          this.loadingDoorColor = false
        })
      })
    },
    onExcelSuccess({ results, header }) {
      this.fetchData()
    }
  }
}
</script>

<style>
.radio-menu .radio-menu-item{
  margin-right: 5px;
}
.radio-menu .el-radio.radio-menu-item.is-bordered{
  margin-left: 0;
}
.dialog-form-item .el-form-item__label{
  padding: 0;
}
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
<style lang="scss" scoped>
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
		background: #d6d2d2;
		margin-bottom: 10px;
		border-radius: 4px;
		font-size: 14px;
	}
.avatar {
  width: 50px;
  height: 50px;
  display: block;
}
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
.material-box{
  text-align: center;
}
.brand-box{
  display: inline-block;
  margin-right: 5px;
}
.brand-button{
  display: inline-block;
}
.header-a-border{
  display: flex;
  justify-content: center;
  align-items: center;
}
.dialog-form{
  max-height: 50vh;
  overflow: auto;
}
.dialog-size-item{
  display: block;
  margin-left: 25px;

  .dialog-size-input{
    display: inline-block;
    width: 95px;
  }
  .dialog-size-input-block{
    display: inline-block;
    position: relative;
    width: 221px;

    .dialog-size-input:last-child{
      position: absolute;
      right: 0;
    }
  }
}
.dialog-item{
  display: inline-block;
  width: 200px;
  margin-left: 25px;
}
.dialog-checkbox{
  float: left;
  line-height: 40px;
}
.dialog-form-item{
  margin-left: 25px;
}
.size-divide{
  display: inline-block;
  width: 30px;
  text-align: center;
}
.selected-condition{
  font-size: 14px;
  line-height: 24px;
  padding-bottom: 6px;

  a{
    display: inline-block;
    margin: 0 5px;
  }
  i{
    border: 1px solid #e4393c;
    color: #e4393c;
  }
}
.dialog-checkbox-control{
  float: left;
}
.my-checkbox{
  white-space: nowrap;
  cursor: pointer;
  outline: none;
  display: inline-block;
  line-height: 1;
  position: relative;
  vertical-align: middle;

  &.is-checked{
    .my-checkbox-inner{
      background-color: #1890ff;
      border-color: #1890ff;
    }
  }

  .my-checkbox-inner{
    display: inline-block;
    position: relative;
    border: 1px solid #DCDFE6;
    border-radius: 2px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 14px;
    height: 14px;
    background-color: #fff;
    z-index: 1;
    transition: border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46),background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);

    &:after{
      height: 6px;
      width: 2px;
      box-sizing: content-box;
      content: "";
      border: 1px solid #fff;
      border-left: 0;
      border-top: 0;
      left: 4px;
      position: absolute;
      top: 1px;
      transform: rotate(45deg) scaleY(1);
      transition: transform .15s ease-in .05s, -webkit-transform .15s ease-in .05s;
      transform-origin: center;
    }
  }

  .select-all{
    margin-right: 10px;
    background-color: rgb(160, 207, 255);
    color: white;
    border: 1px solid rgb(160, 207, 255);
    border-radius: 2px;

    &:hover{
      border: 1px solid #46a6ff;
      background-color: #46a6ff;
    }
  }
}
.excel-item{
  margin-right: 5px;
}
</style>
