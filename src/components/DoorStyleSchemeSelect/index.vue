<template>
  <div>
    <el-col :span="5">
      <el-input
        v-model="searchText"
        size="mini"
        clearable
        placeholder="查找"
      />
    </el-col>
    <el-col :span="2">
      <el-button
        type="primary"
        size="mini"
        icon="el-icon-search"
        style="margin-top:0px;"
        @click="onSearch"
      />
    </el-col>
    <el-table
      ref="elTable1"
      v-loading="listLoading"
      :data="datas"
      element-loading-text="Loading"
      border
      fit
      max-height="700px"
      highlight-current-row
    >
      <el-table-column type="expand" label="展开" width="80">
        <template slot-scope="{row}">
          <div>
            <el-table
              ref="elTable2"
              :data="row.door_styles"
              border
              fit
              highlight-current-row
            >
              <el-table-column align="center" label="ID" width="50">
                <template slot-scope="scope">
                  {{ scope.$index + 1 }}
                </template>
              </el-table-column>
              <el-table-column v-for="item in doorStyleOptions" :key="item.key" :label="item.name" align="center" :width="item.width">
                <template slot-scope="scope">
                  {{ scope.row[item.key] }}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <!-- {{ scope.$index + 1 }} -->
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="名称" width="300">
        <template slot-scope="{row}">
          {{ row.name }}
        </template>
      </el-table-column>
      <el-table-column label="说明">
        <template slot-scope="{row}">
          {{ row.comment }}
        </template>
      </el-table-column>
      <el-table-column label="反向约束" width="80" align="center">
        <template slot-scope="{row}">
          {{ row.mode | booean }}
        </template>
      </el-table-column>
      <el-table-column label="门板数量" width="120" align="center">
        <template slot-scope="{row}">
          {{ row.door_styles.length }}
        </template>
      </el-table-column>

      <!-- <sku-status-column /> -->

      <el-table-column label="选择" align="center" width="150">
        <template slot-scope="{row,$index}">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-check"
            @click="onSelect(row,$index)"
          />
        </template>
      </el-table-column>

    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.per_page" @pagination="fetchData" />
  </div>
</template>

<script type="text/javascript">
import { getDoorStyleScheme } from '@/api/doorstyle'
import Pagination from '@/components/Pagination'

export default {
  name: 'DoorStyleSchemeSelect',
  components: { Pagination },
  props: {
    searchText: {
      require: true,
      type: String,
      default: ''
    }
  },
  data() {
    return {
      listLoading: false,
      datas: [],
      doorStyleOptions: [
        { key: 'door_series', name: '门板系列', width: 220 },
        { key: 'door_price', name: '门板价格', width: 220 },
        { key: 'door_shape', name: '门板造型', width: 220 },
        { key: 'door_ext4', name: 'ext4', width: 80 },
        { key: 'door_ext5', name: 'ext5', width: 80 },
        { key: 'door_ext6', name: 'ext6', width: 80 },
        { key: 'door_color', name: '门板颜色', width: 220 }
      ],
      listQuery: {
        page: 1,
        per_page: 20,
        name: undefined
      },
      total: 0
    }
  },
  computed: {
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.listLoading = true
      const { data } = await getDoorStyleScheme(this.searchText, this.listQuery)
      this.datas = data.items
      this.total = data.total
      this.listLoading = false
    },
    onDeleteMat(index) {
      this.data.splice(index, 1)
    },
    onAddMat() {
      this.dialogFormVisible = true
    },
    onCopy() {
      this.$clipboard.door_style_scheme = JSON.stringify(this.data)
      this.$message.copyOk()
    },
    onPaste() {
      this.data.splice(0, this.data.length)
      const data = JSON.parse(this.$clipboard.door_style_scheme)
      data.forEach(el => {
        this.data.push({ 'id': el.id, 'name': el.name, 'mode': el.mode })
      })
      this.$message.pasteOk()
    },
    onSelect(row, index) {
      this.$emit('select', row)
    },
    onSearch() {
      this.listQuery.page = 1
      this.fetchData()
    }
  }
}
</script>
