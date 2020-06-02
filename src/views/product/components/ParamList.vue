<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="product.params"
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
      <el-table-column align="center" label="名称" width="100">
        <template slot-scope="{row}">
          {{ row.param }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="别名" width="100">
        <template slot-scope="{row}">
          {{ row.alias }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="参数值" width="120">
        <template slot-scope="{row}">
          {{ row.value }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="最小值" width="120">
        <template slot-scope="{row}">
          {{ row.vmin }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="最大值" width="120">
        <template slot-scope="{row}">
          {{ row.vmax }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="参数描述" width="150">
        <template slot-scope="{row}">
          {{ row.desc }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      listLoading: false
    }
  },
  methods: {
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

