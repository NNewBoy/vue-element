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
    <upload-excel action="/doorinner/import" :on-success="onExcelSuccess" :visible="false" />
    <el-table
      v-loading="listLoading"
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
      <el-table-column align="center" label="门板颜色" width="120">
        <template slot-scope="{row}">
          {{ row.door_color }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="门板类型" width="100">
        <template slot-scope="{row}">
          {{ row.door_type | DoorType }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="编号" width="100" :render-header="renderHeader">
        <template slot-scope="{row}">
          {{ row.inner_zone_no }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="图片" width="200">
        <template slot-scope="{row}">
          {{ row.inner_zone_pic }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="默认材料" width="100">
        <template slot-scope="{row}">
          <show-material :data="row.default_material" :on-select="onSelectDefaultMat.bind(null, row)" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="可选材料" width="320">
        <template slot-scope="{row}">
          <multi-mat-list :data="row.inner_mat" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="门芯类型" width="100">
        <template slot-scope="{row}">
          {{ row.inner_type }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="ShapeCode" width="100">
        <template slot-scope="{row}">
          {{ row.inner_door_shape_code }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150"> <!--  最后一列自动后弹 -->
        <template slot-scope="{row,$index}">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-check"
            @click="onSave(row,$index)"
          />
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
  </div>
</template>

<script>
import { getInnerCatalog, getDoorInnerList, updateDoorInner, deleteDoorInner } from '@/api/doorstyle'/** , addDoorInner */
import MultiFilter from '@/components/MultiFilter'
import { editDelete, confirmEdit } from '@/utils/edit'
import MultiMatList from '@/components/MultiMatList'
import BrandColumn from '@/components/BrandColumn'
import SkuStatusColumn from '@/components/SkuStatusColumn'
import UploadExcel from '@/components/UploadExcel'
import ShowMaterial from './components/ShowMaterial'

export default {
  components: { MultiFilter, MultiMatList, BrandColumn, SkuStatusColumn, UploadExcel, ShowMaterial },
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
      selectArr: []
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
    renderHeader(h, { column, $index }) {
      return h('span', {}, [
        h('span', {}, '编号'),
        h('el-popover', { props: { placement: 'top-start', width: '250', trigger: 'hover', content: '门芯区域号(从1开始，必须连续)' }}, [
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
      })
    },
    onSave(row, index) {
      confirmEdit(() => {
        this.listLoading = true
        updateDoorInner(row)
          .then(response => {
            this.$message.editOk()
            this.listLoading = false
          })
          .catch(() => {
            this.listLoading = false
          })
      })
    },
    onAddMat(row) {
      //
    },
    onExcelSuccess({ results, header }) {
      this.fetchData()
    },
    onSelectDefaultMat(row, mat) {
      row.default_mat_id = mat.id
      row.default_material = mat
    }
  }
}
</script>
