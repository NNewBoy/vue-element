<template>
  <div class="app-container">
    <el-table-column align="center" :label="label" :width="width" :min-width="minWidth">
      <template slot-scope="{row}">
        <el-input v-model="row[value]" class="input-one" size="small" placeholder="请输入内容" @change="onChange(row)" />
        <span>{{ row[value] }}</span>
      </template>
    </el-table-column>
  </div>
</template>

<script type="text/javascript">
/**
 * @property {String} label 列名
 * @property {String} width 列宽
 * @property {String} minWidth 最小列宽
 * @property {String} value 列绑定的字段名
 */

export default {
  name: 'CommonColumn',
  props: {
    label: {
      require: true,
      type: String,
      default: ''
    },
    width: {
      require: false,
      type: String,
      default: ''
    },
    minWidth: {
      require: false,
      type: String,
      default: ''
    },
    value: {
      require: true,
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  methods: {
    onChange(row) {
      row.editStatus = 1
    }
  }
}
</script>

<style scoped>
.tb-edit .el-input {
  display: none
}
.tb-edit .current-row .el-input {
  display: block
}
.tb-edit .current-row .el-input+span {
  display: none
}
</style>
