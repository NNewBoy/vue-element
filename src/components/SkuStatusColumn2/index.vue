<template>
  <div class="app-container">
    <el-table-column label="上架状态" width="100" align="center">
      <template slot-scope="{row}">
        <el-select v-model="row.status">
          <el-option
            v-for="(o, i) in statusList"
            :key="i"
            :label="o.text"
            :value="o.value"
          />
        </el-select>
        <span>{{ row.status | skuStatus }}</span>
      </template>
    </el-table-column>
  </div>
</template>

<script type="text/javascript">

export default {
  name: 'SkuStatusColumn',
  filters: {
    skuStatus: function(val) {
      switch (val) {
        case 0:
        case null:
          return '隐藏'
        case 1:
          return '上架'
        case 2:
          return '下架'
        default:
          return '未知:' + val
      }
    }
  },
  props: {

  },
  data() {
    return {
      statusList: [
        { value: 0, text: '隐藏' },
        { value: 1, text: '上架' },
        { value: 2, text: '下架' }
      ]
    }
  },
  computed: {
  },
  created() {
  },
  methods: {
  }
}
</script>

<style scope>
.el-table .current-row .el-select+span {
  display: none
}
</style>
