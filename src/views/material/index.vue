<template>
  <div class="app-container">
    <MultiFilter
      :datas="cascaderDatas"
      :filter-names="['材质分类','材质系列']"
      :multi-choices="[false,false]"
      @getResult="getResult"
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
        <el-button type="primary" plain size="small" @click="editCatalogName">编辑目录名</el-button>
      </div>

      <div class="menu-item radio-menu">
        <el-radio v-model="radioVal" class="radio-menu-item" border size="small" label="material">
          材质参数
        </el-radio>
        <el-radio v-model="radioVal" class="radio-menu-item" border size="small" label="catalog">
          移动目录
        </el-radio>
        <el-radio v-model="radioVal" class="radio-menu-item" border size="small" label="picture">
          贴图属性
        </el-radio>
        <el-button-group v-if="radioVal!==''" class="edit-button">
          <el-button type="primary" size="small" @click="selectMaterial">批量编辑</el-button>
        </el-button-group>
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
      v-loading="listLoading"
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

      <el-table-column align="center" label="ID" width="50">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="图片" width="130px">
        <template slot-scope="{row}">
          <el-upload
            class="hotadv-uploader"
            action="/api/mat/uploadpic__"
            :data="{'token':token, 'mid': row.id}"
            :show-file-list="false"
            :on-success="onUploadPicSuccess.bind(null, row)"
            :before-upload="beforePicUpload"
          >
            <el-image v-if="row.pic_file_name" :src="getPicUrl(row.pic_file_name)" class="avatar" />
            <i v-else class="el-icon-plus hotadv-uploader-icon" />
          </el-upload>
        </template>
      </el-table-column>

      <CommonColumn label="名称" min-width="200" value="name" />

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

      <div v-if="radioVal==='material'">
        <MaterialColumn />
      </div>

      <div v-if="radioVal==='picture'">
        <MaterialPictureColumn />
      </div>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.per_page" @pagination="mats=[]" />

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
      :cascader-datas="cascaderDatas"
      :search-target="searchTarget"
      @closeCatalogDialog="closeDialog('catalog')"
      @returnCatalog="changeCatalog"
    />
    <MaterialPictureDialog
      :dialog-visible="materialPictureDialogVisible"
      :material-checkbox-val="selection"
      :table-data="tableDataFilter"
      @closeDialog="closeDialog('materialPic')"
      @returnMaterialPicture="getMaterialPicture"
    />
    <CatalogNameDialog
      :catalog-name-dialog-visible="catalogNameDialogVisible"
      :cascader-datas="cascaderDatas"
      :search-target="searchTarget"
      @closeDialog="closeDialog('catalogName')"
      @returnCatalogName="changeCatalogName"
    />
  </div>
</template>

<script>
import { getCatalog, getMat, updateMat, deleteMat } from '@/api/material' /** , addMat */
import { getThumbnailUrl, checkPicBeforeUpload } from '@/utils/pic'
import { getToken } from '@/utils/auth'
import { editDelete } from '@/utils/edit'
import { confirmEdit } from '@/utils/edit'
import Pagination from '@/components/Pagination'
import MultiFilter from '@/components/MultiFilter'
import CommonColumn from '@/components/MaterialEdit/column/CommonColumn'
import SkuStatusColumn from '@/components/SkuStatusColumn2'
import BrandColumn from '@/components/BrandColumn'
import BrandsFilter from '@/components/MaterialEdit/filter/BrandsFilter'
import StatusFilter from '@/components/MaterialEdit/filter/StatusFilter'
import MaterialColumn from '@/components/MaterialEdit/column/MaterialColumn'
import MaterialDialog from '@/components/MaterialEdit/dialog/MaterialDialog'
import CatalogDialog from '@/components/MaterialEdit/dialog/CatalogDialog'
import MaterialPictureColumn from '@/components/MaterialEdit/column/MaterialPictureColumn'
import MaterialPictureDialog from '@/components/MaterialEdit/dialog/MaterialPictureDialog'
import CatalogNameDialog from '@/components/MaterialEdit/dialog/CatalogNameDialog'
import toPinyin from '@/utils/chineseToPinyin'

export default {
  components: { Pagination, MultiFilter, BrandsFilter, StatusFilter, CommonColumn, SkuStatusColumn, BrandColumn, MaterialColumn, MaterialDialog, CatalogDialog, MaterialPictureColumn, MaterialPictureDialog, CatalogNameDialog },
  data() {
    return {
      listLoading: false,
      token: getToken(),
      mats: [],
      total: 0,
      listQuery: {
        page: 1,
        per_page: 20,
        name: undefined
      },
      cascaderDatas: [],
      nowCatalog: [],
      searchTarget: 'name',
      searchText: '',
      radioVal: '', // 选择材料参数
      materialDialogVisible: false,
      catalogDialogVisible: false,
      materialPictureDialogVisible: false,
      catalogNameDialogVisible: false,
      selection: [],
      selectStatusRes: {}, // 上架状态筛选器的返回值
      selectBrandsRes: {}, // 品牌筛选器的返回值
      ifUpdate: false // 判断是否刷新数据
    }
  },
  computed: {
    tableDataFilter: function() {
      return this.mats.filter(el => {
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
            this.fetchMaterial().then(() => {
              this.brandsFilterFunc()
            })
          } else if (this.selectStatusRes.check.length > 0) {
            this.fetchMaterial().then(() => {
              const temp = []
              for (const item of this.mats) {
                for (const i of this.selectStatusRes.check) {
                  if (item.status === i) {
                    temp.push(item)
                    break
                  }
                }
              }
              this.mats = JSON.parse(JSON.stringify(temp))
            }).then(() => {
              this.brandsFilterFunc()
            })
          } else if (this.selectStatusRes.check.length === 0) {
            this.mats = []
          }
        }

        this.ifUpdate = false
        this.$refs.tbTable.doLayout()
      }
    }
  },
  created() {
    this.fetchCatalog()
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
            for (const item of this.mats) {
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
            this.mats = JSON.parse(JSON.stringify(temp))
          } else if (this.selectBrandsRes.check.length === 0) {
            this.mats = []
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
      } else if (target === 'materialPic') {
        this.materialPictureDialogVisible = false
      } else if (target === 'catalogName') {
        this.catalogNameDialogVisible = false
      }
      this.$refs.tbTable.clearSelection() // 清空选项
    },
    selectMaterial() {
      if (this.selection.length > 0) {
        if (this.radioVal === 'material') {
          this.materialDialogVisible = true
        } else if (this.radioVal === 'catalog') {
          this.catalogDialogVisible = true
        } else if (this.radioVal === 'picture') {
          this.materialPictureDialogVisible = true
        }
      }
    },
    handleSelectionChange(selection) {
      this.selection = selection
    },
    saveProperty() {
      const editedArr = this.mats.filter(item => item.editStatus === 1)
      if (editedArr.length > 0) {
        confirmEdit(() => {
          this.listLoading = true
          updateMat(editedArr)
            .then(response => {
              this.listLoading = false
              this.$message.editOk()
              this.fetchMaterial()
            })
            .catch(() => {
              this.listLoading = false
              this.$notify.editError()
            })
        })
      }
    },
    resetProperty() {
      this.searchText = ''
      this.fetchMaterial()
    },
    editCatalogName() { // 显示修改目录名对话框前的判断，需先保存修改的数据
      const editedArr = this.mats.filter(item => item.editStatus === 1)
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
      this.listLoading = true
      // updateMat(params).then(() => {
      console.log(catalog.origin) // 目标目录
      console.log(catalog.change) // 改变后的目录
      this.listLoading = false
      this.$message.editOk()
      this.fetchCatalog() // 重新加载目录
      // }).catch(() => {
      //   this.loadingDoorColor = false
      //   this.$notify.editError()
      // })
    },
    getMaterialPicture(picture) { // 贴图属性
      for (const item of picture) {
        const index = this.mats.findIndex(v => v.id === item.id)
        this.mats[index].editStatus = 1
        for (const val in item) {
          if (val !== 'id') { this.mats[index][val] = item[val] }
        }
        this.$refs.tbTable.doLayout()
      }
      this.$refs.tbTable.clearSelection() // 清空选项
    },
    changeCatalog(catalog) { // 移动目录
      confirmEdit(() => {
        for (const item of catalog.id) {
          const index = this.mats.findIndex(v => v.id === item)
          this.mats[index].editStatus = 1
          this.mats[index].use_group = catalog.to[0]
          this.mats[index].texture_group = catalog.to[1]
          this.$refs.tbTable.doLayout()
        }
        const editedArr = this.mats.filter(item => item.editStatus === 1)
        this.listLoading = true
        updateMat(editedArr)
          .then(response => {
            this.listLoading = false
            this.$message.editOk()
            this.fetchMaterial()
          })
          .catch(() => {
            this.listLoading = false
            this.$notify.editError()
          })
      })
      this.$refs.tbTable.clearSelection() // 清空选项
    },
    getMaterial(material) { // 材质参数
      for (const item of material) {
        const index = this.mats.findIndex(v => v.id === item.id)
        this.mats[index].editStatus = 1
        for (const val in item) {
          if (val !== 'id') { this.mats[index][val] = item[val] }
        }
        this.$refs.tbTable.doLayout()
      }
      this.$refs.tbTable.clearSelection() // 清空选项
    },
    async fetchCatalog() {
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
    getPicUrl(pic) {
      return getThumbnailUrl(pic) // + '?' + Math.random()
    },
    beforePicUpload(file) {
      return checkPicBeforeUpload(file)
    },
    onUploadPicSuccess(row, res, file) {
      if (res.success) {
        const tmp = row.pic_file_name
        row.pic_file_name = null
        row.pic_file_name = tmp
        this.$notify.uploadOk()
      } else {
        this.$notify.uploadError()
      }
    },
    onDelete(row, index) {
      editDelete(() => {
        this.listLoading = true
        deleteMat(row.id).then(response => {
          this.$notify.deleteOk()
          this.mats.splice(index, 1)

          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      })
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
</style>
