<template>
  <div class="app-container">
    <PlTableColumn show-overflow-tooltip :label="label" :width="width" :min-width="minWidth" align="center">
      <template slot-scope="{row}">
        <el-select v-model="row[value]" :filterable="filterable" @change="onChange(row)">
          <el-option
            v-for="(o, i) in dataList"
            :key="i"
            :label="o.text"
            :value="o.value"
          />
        </el-select>
        <span class="select-span">{{ getText(row[value]) }}</span>
      </template>
    </PlTableColumn>
  </div>
</template>

<script type="text/javascript">
/**
 * 使用该column组件的el-table需加上类名tb-edit
 * @property {Array} dataList 选项数据，格式[{ value: 0, text: 'xx' }]
 * @property {String} label 列名
 * @property {String} width 列宽
 * @property {String} minWidth 最小列宽
 * @property {String} value 列绑定的字段名
 * @property {Boolean} filterable 是否可搜索
 */
import { PlTableColumn } from 'pl-table'
export default {
  name: 'SelectColumn',
  components: { PlTableColumn },
  props: {
    dataList: {
      required: true,
      type: Array,
      default() {
        return []
      }
    },
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
    },
    filterable: {
      require: false,
      type: Boolean,
      default: false
    }
  },
  methods: {
    onChange(row) {
      row.changed = 1
    },
    getText(data) {
      const res = this.dataList.find((val) => val.value === data)
      return res ? res.text : ''
    }
  }
}
</script>

<style lang="scss">
.tb-edit .el-select {
  display: none
}
.tb-edit .current-row .el-select {
  display: block
}
.tb-edit .current-row .select-span {
  display: none
}
</style>
