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
    <!-- {{ doorStyle }} -->
    <MaterialEdit
      :datas="doorstyleList"
      :cascader-datas="catalogs"
      :from-catalog="nowCatalog"
      :list-loading="loadingDoorColor"
      search-target="door_color"
      @getParams="getParams"
      @returnCatalog="changeCatalog"
      @returnDoorPicture="getDoorPicture"
      @returnCatalogName="changeCatalogName"
    >
      <el-table-column align="center" label="ID" width="40">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="颜色" min-width="200">
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

      <sku-status-column />

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
  </div>
</template>

<script>
import { getCatalog, getColorList, updateDoorStyle, deleteDoorStyle } from '@/api/doorstyle' /** , addDoorStyle */
import { getPicUrl, checkPicBeforeUpload } from '@/utils/pic'
import { getToken } from '@/utils/auth'
import { editDelete } from '@/utils/edit'
import MultiFilter from '@/components/MultiFilter'
import MaterialEdit from '@/components/MaterialEdit'
import SkuStatusColumn from '@/components/SkuStatusColumn'

export default {
  components: { MultiFilter, MaterialEdit, SkuStatusColumn },
  data() {
    return {
      token: getToken(),
      catalogs: [],
      loadingDoorColor: false,
      doorstyleList: [],
      selectArr: [],
      restSelectArr: [],
      nowCatalog: []
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
    getDoorPicture(picture) { // 贴图属性
      this.loadingDoorColor = true
      updateDoorStyle(picture).then(() => {
        for (const item of picture) {
          const index = this.doorstyleList.findIndex(v => v.id === item.id)
          for (const val in item) {
            if (val !== 'id') { this.doorstyleList[index][val] = item[val] }
          }
        }
        this.loadingDoorColor = false
        this.$message.editOk()
      }).catch(() => {
        this.loadingDoorColor = false
        this.$notify.editError()
      })
    },
    changeCatalog(catalog) { // 移动目录
      this.loadingDoorColor = true
      // addDoorStyle(params).then(() => {
      for (const item of catalog.id) {
        // deleteDoorStyle(item).then(response => {
        const index = this.doorstyleList.findIndex(v => v.id === item)
        this.doorstyleList.splice(index, 1)
        // }).catch(() => {})
      }
      this.loadingDoorColor = false
      this.$message.editOk()
      // }).catch(() => {
      //   this.loadingDoorColor = false
      //   this.$notify.editError()
      // })
    },
    getParams(params) { // 材质参数
      this.loadingDoorColor = true
      updateDoorStyle(params).then(() => {
        for (const item of params) {
          const index = this.doorstyleList.findIndex(v => v.id === item.id)
          for (const val in item) {
            if (val !== 'id') { this.doorstyleList[index][val] = item[val] }
          }
        }
        this.loadingDoorColor = false
        this.$message.editOk()
      }).catch(() => {
        this.loadingDoorColor = false
        this.$notify.editError()
      })
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
      this.loadingDoorColor = true
      const { data } = await getColorList(this.allDoorStyle)
      this.doorstyleList = data
      this.loadingDoorColor = false
    },
    getPicUrl(pic) {
      return getPicUrl(pic) // + '?' + Math.random()
    },
    getDoorPicUrl(folder) {
      return getPicUrl(folder + 'door_800x800.jpg') // + '?' + Math.random()
    },
    getDrawerPicUrl(folder) {
      return getPicUrl(folder + 'drawer_800x800.jpg') // + '?' + Math.random()
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
