<template>
  <div class="app-container">
    <typeFilter :data="menuList" fliter-name="材质分类" :multi-choice="true" @getType="getType1" />
    <typeFilter v-show="showSrcondMenu" :data="secondMenuList" fliter-name="材质系列" :multi-choice="false" @getType="getType2" />

    <el-table
      v-loading="listLoading"
      :data="mats"
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
      <el-table-column align="center" label="名称" width="200">
        <template slot-scope="{row}">
          {{ row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="图片">
        <template slot-scope="{row}">
          {{ row.pic_file_name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="图片" width="130px">
        <template slot-scope="{row}">
          <el-upload
            class="hotadv-uploader"
            action="/api/mat/uploadpic"
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
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.per_page" @pagination="fetchMaterial" />
  </div>
</template>

<script>
import { getCatalog, getMat } from '@/api/material'
// import { getPicUrl, checkPicBeforeUpload } from '@/utils/pic'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination'
// import waves from '@/directive/waves'
import typeFilter from '@/components/TypeFilter'

export default {
  components: { Pagination, typeFilter },
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
      showSrcondMenu: false
    }
  },
  created() {
    this.fetchCatalog()
  },
  methods: {
    async fetchCatalog() {
      const { data } = await getCatalog()
      this.catalog = data
      this.menuList = Object.keys(data)

      // 默认选首个目录
      // this.getType1([{ name: this.menuList[0], index: 0 }])
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
        // this.fetchMaterial()
      }
    },
    getPicUrl(pic) {
      // return getPicUrl(pic) + '?' + Math.random()
    },
    beforePicUpload(file) {
      // return checkPicBeforeUpload(file)
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
		background: #d6d2d2;
		margin-bottom: 10px;
		border-radius: 4px;
		font-size: 14px;
	}
</style>
