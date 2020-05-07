<template>
  <div ref="list_body" class="app-container">
    <div class="dir-container">
      门板系列
      <el-tag
        v-for="(item, index) in doorSeries"
        :key="index"
        :class="item.selected ? 'select-tag' : 'unselect-tag' "
        @click="onSelectDir(catalogs, index)"
      >
        {{ item.name }}
      </el-tag>
    </div>
    <div class="dir-container">
      门板价格
      <el-tag
        v-for="(item, index) in doorPrice"
        :key="index"
        :class="item.selected ? 'select-tag' : 'unselect-tag' "
        @click="onSelectDir(doorPrice, index)"
      >
        {{ item.name }}
      </el-tag>
    </div>
    <div class="dir-container">
      门板造型
      <el-tag
        v-for="(item, index) in doorShape"
        :key="index"
        :class="item.selected ? 'select-tag' : 'unselect-tag' "
        @click="onSelectDir(doorShape, index)"
      >
        {{ item.name }}
      </el-tag>
    </div>
    <div v-if="doorExt4.length>1" class="dir-container">
      门板Ext4
      <el-tag
        v-for="(item, index) in doorExt4"
        :key="index"
        :class="item.selected ? 'select-tag' : 'unselect-tag' "
        @click="onSelectDir(doorExt4, index)"
      >
        {{ item.name }}
      </el-tag>
    </div>
    <div v-if="doorExt5.length>1" class="dir-container">
      门板Ext5
      <el-tag
        v-for="(item, index) in doorExt5"
        :key="index"
        :class="item.selected ? 'select-tag' : 'unselect-tag' "
        @click="onSelectDir(doorExt5, index)"
      >
        {{ item.name }}
      </el-tag>
    </div>
    <div v-if="doorExt6.length>1" class="dir-container">
      门板Ext6
      <el-tag
        v-for="(item, index) in doorExt6"
        :key="index"
        :class="item.selected ? 'select-tag' : 'unselect-tag' "
        @click="onSelectDir(doorExt6, index)"
      >
        {{ item.name }}
      </el-tag>
    </div>
    <!-- {{ doorStyle }} -->
    <div>
      <el-table
        v-loading="loadingDoorColor"
        :data="doorstyleList"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
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
      </el-table>
    </div>
  </div>
</template>

<script>
// import Sticky from '@/components/Sticky'
import { getCatalog, getColorList } from '@/api/doorstyle'
// import { getPicUrl, checkPicBeforeUpload } from '@/utils/pic'
import { getToken } from '@/utils/auth'
// import { editDelete } from '@/utils/edit'

export default {
  // components: { Sticky },
  data() {
    return {
      token: getToken(),
      catalogs: [],
      loadingDoorColor: false,
      doorstyleList: []
    }
  },
  computed: {
    doorSeries() {
      return this.catalogs
    },
    doorPrice() {
      const ds = this.catalogs.find(element => element.selected)
      return ds ? ds.next : []
    },
    doorShape() {
      const ds = this.doorPrice.find(element => element.selected)
      return ds ? ds.next : []
    },
    doorExt4() {
      const ds = this.doorShape.find(element => element.selected)
      return ds ? ds.next : []
    },
    doorExt5() {
      const ds = this.doorExt4.find(element => element.selected)
      return ds ? ds.next : []
    },
    doorExt6() {
      const ds = this.doorExt5.find(element => element.selected)
      return ds ? ds.next : []
    },
    doorStyle() {
      const fn = (function() {
        return function fun(dirs) {
          let str
          const sub = dirs.find(element => element.selected)
          if (sub) {
            str = sub.name
            if (sub.next && sub.next.length > 0) {
              str += '\\' + fun(sub.next)
            }
          }
          return str
        }
      })()
      return fn(this.catalogs)
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const { data } = await getCatalog()
      console.log(data)

      const calCatalog = (function() {
        return function fun(dirs) {
          const catalogs = []
          for (const dir in dirs) {
            let next = []
            if (Array.isArray(dirs[dir])) {
              dirs[dir].forEach(element => {
                next.push({ name: element, selected: false })
              })
              next[0].selected = true
            } else {
              next = fun(dirs[dir])
            }

            catalogs.push({ name: dir, selected: false, next })
          }
          catalogs[0].selected = true
          return catalogs
        }
      })()

      this.catalogs = calCatalog(data)
      console.log(this.catalogs)
      this.fetchDoorColor()
    },
    onSelectDir(cats, index) {
      cats.forEach((element, i) => {
        element.selected = index === i
      })
      this.fetchDoorColor()
    },
    async fetchDoorColor() {
      this.loadingDoorColor = true
      console.log(this.doorStyle)
      const { data } = await getColorList(this.doorStyle)
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
