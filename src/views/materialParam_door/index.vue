<template>
  <div ref="list_body" class="app-container">
    <MultiFilter
      :datas="catalogs"
      :levels="3"
      :filter-names="['门板系列','门板价格','门板造型']"
      :multi-choices="[true,true,false]"
      @getResult="getResult"
    />
    <MultiFilter
      :datas="restCatalogs"
      :levels="3"
      :show-num-len="2"
      :filter-names="['门板Ext4','门板Ext5','门板Ext6']"
      :multi-choices="[true,true,false]"
      @getResult="getResult2"
    />
    <!-- {{ doorStyle }} -->
    <MaterialEdit :datas="doorstyleList" :list-loading="loadingDoorColor" search-target="door_color" @getParams="getParams">
      <el-table-column align="center" label="ID" width="40">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="颜色" width="200">
        <template slot-scope="{row}">
          {{ row.door_color }}
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
            <el-image v-if="row.preview_pic" :src="getPicUrl(row.preview_pic)" class="avatar" />
            <i v-else class="el-icon-plus hotadv-uploader-icon" />
          </el-upload>
        </template>
      </el-table-column>
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
            <el-image v-if="row.preview_pic" :src="getDoorPicUrl(row.folder)" class="avatar" />
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
            <el-image v-if="row.preview_pic" :src="getDrawerPicUrl(row.folder)" class="avatar" />
            <i v-else class="el-icon-plus hotadv-uploader-icon" />
          </el-upload>
        </template>
      </el-table-column>
      <el-table-column align="center" label="目录">
        <template slot-scope="{row}">
          {{ row.folder }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="ShapeCode" width="100">
        <template slot-scope="{row}">
          {{ row.door_shape_code }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="厚度" width="50">
        <template slot-scope="{row}">
          {{ row.door_thick }}
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="图片">
          <template slot-scope="{row}">
            {{ row.pic_file_name }}
          </template>
        </el-table-column> -->
    </MaterialEdit>
  </div>
</template>

<script>
// import Sticky from '@/components/Sticky'
import { getCatalog, getColorList } from '@/api/doorstyle'
// import { getPicUrl, checkPicBeforeUpload } from '@/utils/pic'
import { getToken } from '@/utils/auth'
// import { editDelete } from '@/utils/edit'
import MultiFilter from '@/components/MultiFilter'
import MaterialEdit from '@/components/MaterialEdit'

export default {
  components: { MultiFilter, MaterialEdit }, // Sticky,
  data() {
    return {
      token: getToken(),
      catalogs: [],
      loadingDoorColor: false,
      doorstyleList: [],
      selectArr: [],
      restSelectArr: []
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
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    getParams(params) {
      // updateArticle(params).then(() => {
      for (const item of params) {
        const index = this.doorstyleList.findIndex(v => v.id === item.id)
        for (const val in item) {
          if (val !== 'id') { this.doorstyleList[index][val] = item[val] }
        }
      }
      this.$notify({
        title: 'Success',
        message: '数据修改成功',
        type: 'success',
        duration: 2000
      })
      // }).catch(() => {
      //   this.$notify({
      //     title: 'Error',
      //     message: '数据修改失败，请检查网络',
      //     type: 'error',
      //     duration: 2000
      //   })
      // })
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
        // this.fetchDoorColor()
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
      this.loadingDoorColor = true
      const { data } = await getColorList(this.allDoorStyle)
      this.doorstyleList = data
      this.loadingDoorColor = false
    },
    getPicUrl(pic) {
      // return getPicUrl(pic) // + '?' + Math.random()
    },
    getDoorPicUrl(folder) {
      // return getPicUrl(folder + 'door_800x800.jpg') // + '?' + Math.random()
    },
    getDrawerPicUrl(folder) {
      // return getPicUrl(folder + 'drawer_800x800.jpg') // + '?' + Math.random()
    },
    beforePicUpload(file) {
      // return checkPicBeforeUpload(file)
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
    }
  }
}
</script>

<style scoped>
.select-tag {
  background-color: #5153d4 !important;
  color: white !important;
  border: none;
  margin-left: 10px;
  font-size: 16px;
  line-height: 33px;
}

.unselect-tag {
  border: none;
  margin-left: 10px;
  font-size: 16px;
  line-height: 33px;
}
.dir-container {
  margin: 10px;
}

.avatar {
  width: 50px;
  height: 50px;
  display: block;
}

</style>
