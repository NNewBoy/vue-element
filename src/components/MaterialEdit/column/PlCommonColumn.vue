<template>
  <div class="app-container">
    <PlTableColumn show-overflow-tooltip align="center" :label="label" :width="width" :min-width="minWidth">
      <template slot-scope="{row}">
        <el-input v-model="row[value]" class="input-one" size="small" placeholder="请输入内容" @change="onChange(row)" />
        <span>{{ row[value] }}</span>
      </template>
    </PlTableColumn>
  </div>
</template>

<script type="text/javascript">
/**
 * @property {String} label 列名
 * @property {String} width 列宽
 * @property {String} minWidth 最小列宽
 * @property {String} value 列绑定的字段名
 */
import { PlTableColumn } from 'pl-table'
export default {
  name: 'CommonColumn',
  components: { PlTableColumn },
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
      row.changed = 1
    }
  }
}
</script>

<style lang="scss">
.tb-edit .input-one {
  display: none
}
.tb-edit .current-row .input-one {
  display: block
}
.tb-edit .current-row .input-one+span {
  display: none
}
</style>
