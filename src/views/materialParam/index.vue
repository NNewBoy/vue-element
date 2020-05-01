<template>
  <div class="app-container">
    <typeFilter :data="menuList" filter-name="材质分类" :multi-choice="true" @getType="getType1" />
    <typeFilter v-show="showSrcondMenu" :data="secondMenuList" filter-name="材质系列" :multi-choice="false" @getType="getType2" />
    <MaterialEdit
      :datas="mats"
      :cascader-datas="cascaderDatas"
      :from-catalog="nowCatalog"
      :list-loading="listLoading"
      search-target="name"
      @getParams="getParams"
      @returnCatalog="changeCatalog"
      @returnMaterialPicture="getMaterialPicture"
    >
      <el-table-column align="center" label="ID" width="50">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称" min-width="200">
        <template slot-scope="{row}">
          {{ row.name }}
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
      <!-- <el-table-column align="center" label="图片">
        <template slot-scope="{row}">
          {{ row.pic_file_name }}
        </template>
      </el-table-column> -->
      <el-table-column slot="last_column" label="删除" align="center" width="82" class-name="mini-padding fixed-width">
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
    </MaterialEdit>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.per_page" @pagination="mats=[]" />

  </div>
</template>

<script>
import { getCatalog, getMat, deleteMat } from '@/api/material' /* updateMat, deleteMat, addMat */
import { getPicUrl, checkPicBeforeUpload } from '@/utils/pic'
import { getToken } from '@/utils/auth'
import { editDelete } from '@/utils/edit'
import Pagination from '@/components/Pagination'
// import waves from '@/directive/waves'
import typeFilter from '@/components/TypeFilter'
import MaterialEdit from '@/components/MaterialEdit'

export default {
  components: { Pagination, typeFilter, MaterialEdit },
  // directives: { waves },
  data() {
    return {
      listLoading: false,
      token: getToken(),
      catalog: [],
      activeDir1: '',
      activeDir2: '',
      activeDir: '',
      mats: [],
      total: 0,
      listQuery: {
        page: 1,
        per_page: 20,
        name: undefined
      },
      menuList: [],
      secondMenuList: [],
      parentMenuList: [],
      showSrcondMenu: false,
      cascaderDatas: [],
      nowCatalog: []
    }
  },
  created() {
    this.fetchCatalog()
  },
  methods: {
    getMaterialPicture(picture) { // 贴图属性
      this.listLoading = true
      // updateMat(picture).then(() => {
      for (const item of picture) {
        const index = this.mats.findIndex(v => v.id === item.id)
        for (const val in item) {
          if (val !== 'id') { this.mats[index][val] = item[val] }
        }
      }
      this.listLoading = false
      this.$message.editOk()
      // }).catch(() => {
      //   this.listLoading = false
      //   this.$notify.editError()
      // })
    },
    changeCatalog(catalog) { // 移动目录
      this.listLoading = true
      // updateMat(params).then(() => {
      for (const item of catalog.id) {
        // deleteMat(item).then(response => {
        const index = this.mats.findIndex(v => v.id === item)
        this.mats.splice(index, 1)
        // }).catch(() => {})
      }
      this.listLoading = false
      this.$message.editOk()
      // }).catch(() => {
      //   this.listLoading = false
      //   this.$notify.editError()
      // })
    },
    getParams(params) { // 材质参数
      this.listLoading = true
      // updateMat(params).then(() => {
      for (const item of params) {
        const index = this.mats.findIndex(v => v.id === item.id)
        for (const val in item) {
          if (val !== 'id') { this.mats[index][val] = item[val] }
        }
      }
      this.listLoading = false
      this.$message.editOk()
      // }).catch(() => {
      //   this.listLoading = false
      //   this.$notify.editError()
      // })
    },
    async fetchCatalog() {
      const { data } = await getCatalog()
      this.catalog = data
      this.menuList = Object.keys(data)

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
      const { data } = await getMat(this.activeDir1, this.catalog[this.activeDir1].active, this.listQuery)
      this.mats = data.items
      this.total = data.total
      this.listLoading = false
    },
    getType1(arr) {
      if (arr.length === 0) { // 清空数据
        this.showSrcondMenu = false
        this.mats = []
        this.total = 0
        return
      } else {
        this.showSrcondMenu = true
        this.secondMenuList = []
        this.parentMenuList = []
        arr.map(val => {
          const temp = this.catalog[val.name]
          for (const i of temp) {
            this.secondMenuList.push(i)
            this.parentMenuList.push(val.name)
          }
        })
      }

      // 默认选首个目录
      // this.activeDir1 = this.parentMenuList[0]
      // this.getType2([{ name: this.secondMenuList[0], index: 0 }])
    },
    getType2(arr) {
      if (arr.length === 0) { // 清空数据
        this.mats = []
        this.total = 0
        return
      } else if (arr.length > 0) {
        this.activeDir1 = this.parentMenuList[arr[0].index]
        this.catalog[this.activeDir1].active = arr[0].name
        this.activeDir2 = this.catalog[this.activeDir1].active
        this.nowCatalog = [this.activeDir1, this.activeDir2]
        this.fetchMaterial()
      }
    },
    getPicUrl(pic) {
      return getPicUrl(pic) // + '?' + Math.random()
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
</style>
