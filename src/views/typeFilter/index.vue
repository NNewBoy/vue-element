<template>
  <div class="app-container">
    <table width="100%">
      <tr>
        <td width="80px">材质分类</td>
        <td>
          <p v-for="(value,key) in catalog" :key="key">
            <span :class="activeDir1==key?'active':'Classification'" @click="onCheck1(key)">
              {{ key }}
            </span>
          </p>
        </td>
      </tr>
      <tr>
        <td>材质系列</td>
        <td>
          <div v-for="(value) in catalog[activeDir1]" :key="value">
            <span :class="activeDir2==value?'active':'Classification'" @click="onCheck2(value)">
              {{ value }}
            </span>
          </div>
        </td>
      </tr>
    </table>
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

export default {
  components: { Pagination },
  // directives: { waves },
  data() {
    return {
      listLoading: false,
      token: getToken(),
      catalog: [],
      activeDir1: '',
      activeDir2: '',
      mats: [],
      total: 0,
      listQuery: {
        page: 1,
        per_page: 20,
        name: undefined
      }
    }
  },
  created() {
    this.fetchCatalog()
  },
  methods: {
    async fetchCatalog() {
      const { data } = await getCatalog()
      this.catalog = data
      // // 选首个目录
      // for (var key in this.catalog[this.activeDir1]) {
      //   this.onCheck1(this.catalog[this.activeDir1][key])
      //   break
      // }
    },
    async fetchMaterial() {
      this.listLoading = true
      const { data } = await getMat(this.activeDir1, this.catalog[this.activeDir1].active, this.listQuery)
      this.mats = data.items
      this.total = data.total
      this.listLoading = false
    },
    onCheck1(name) {
      this.activeDir1 = name
      // if (!this.catalog[this.activeDir1].active) {
      //   // 选首个目录
      //   for (var key in this.catalog[this.activeDir1]) {
      //     this.catalog[this.activeDir1].active = this.catalog[this.activeDir1][key]
      //     break
      //   }
      // }
      this.onCheck2(this.catalog[this.activeDir1].active)
    },
    onCheck2(name) {
      if (!name) {
        this.mats = []
        this.total = 0
        return
      }
      this.catalog[this.activeDir1].active = name
      this.activeDir2 = this.catalog[this.activeDir1].active
      this.fetchMaterial()
    },
    getPicUrl(pic) {
      console.log('pause')
      // return getPicUrl(pic) + '?' + Math.random()
    },
    beforePicUpload(file) {
      console.log('pause')
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
