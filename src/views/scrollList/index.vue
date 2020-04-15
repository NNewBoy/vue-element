<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.code" placeholder="门型" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查找
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
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
      <el-table-column label="门型" width="200">
        <template slot-scope="{row}">
          {{ row.code }}
        </template>
      </el-table-column>
      <el-table-column min-width="300px" label="说明">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.comment" class="edit-input" size="small" />
            <el-button
              class="cancel-btn"
              size="mini"
              icon="el-icon-refresh"
              type="warning"
              @click="cancelEdit(row)"
            >
              取消
            </el-button>
          </template>
          <span v-else>{{ row.comment }}</span>
        </template>
      </el-table-column>
      <el-table-column label="锁定" width="80" align="center">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.lock" @change="lockItem(scope.row.code, scope.row.lock)" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="更新时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.update_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="mini-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button
            v-if="row.edit"
            type="success"
            size="mini"
            icon="el-icon-circle-check-outline"
            @click="confirmEdit(row)"
          >
            确定
          </el-button>
          <el-button
            v-else
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="row.edit=!row.edit"
          >
            修改
          </el-button>
          <el-button
            v-if="row.status!='deleted'"
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(row,$index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.per_page" @pagination="fetchData" />
  </div>
</template>

<script>
import { getList, setLock, del, update } from '@/api/doorshape'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { editDelete } from '@/utils/edit'

export default {
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        per_page: 20,
        code: undefined
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.listLoading = true
      const { data } = await getList(this.listQuery)
      const items = data.items
      this.list = items.map(v => {
        this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
        v.originalComment = v.comment //  will be used when user click the cancel botton
        v.lock = v.lock === 1
        return v
      })
      this.total = data.total
      this.listLoading = false
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },
    handleDelete(row, index) {
      editDelete(() => {
        this.listLoading = true
        del(row.code).then(response => {
          this.$notify.deleteOk()
          this.list.splice(index, 1)

          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      })
    },
    cancelEdit(row) {
      row.comment = row.originalComment
      row.edit = false
      this.$message({
        message: '已取消',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      this.listLoading = true
      const data = { code: row.code, comment: row.comment }
      update(data).then(response => {
        row.edit = false
        row.originalComment = row.comment
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    lockItem(code, lock) {
      this.listLoading = true
      setLock(code, lock ? 1 : 0).then(response => {
        this.$notify({
          title: 'Success',
          message: (lock ? '锁定' : '解锁') + '成功',
          type: 'success',
          duration: 2000
        })
        this.listLoading = false
      })
    }
  }
}
</script>
