<template>
  <div class="app-container">
    <el-table-column label="上架状态" :width="width" align="center">
      <template slot-scope="{row}">
        <el-select v-model="row.status" :size="size" @change="setEditStatus(row)">
          <el-option
            v-for="(o, i) in statusList"
            :key="i"
            :label="o.text"
            :value="o.value"
          />
        </el-select>
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
    size: {
      type: String,
      default: 'medium'
    },
    width: {
      type: String,
      default: '100'
    }
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
    setEditStatus(row) {
      if (row.hasOwnProperty('editStatus')) {
        row.editStatus = 1
      } else if (row.hasOwnProperty('changed')) {
        row.changed = true
      }
    }
  }
}
</script>

<style scope>
.el-table >>> .el-input {
  display: block
}
</style>
