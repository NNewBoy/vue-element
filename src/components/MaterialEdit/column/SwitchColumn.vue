<template>
  <div id="select_column_container" class="app-container">
    <el-table-column :label="label" :width="width" :min-width="minWidth" align="center">
      <template slot-scope="{row}">
        <el-switch
          :value="Boolean(row[value])"
          @change="onChange(row)"
        />
      </template>
    </el-table-column>
  </div>
</template>

<script type="text/javascript">
/**
 * 使用改column组件的el-table需加上类名tb-edit
 * @property {String} label 列名
 * @property {String} width 列宽
 * @property {String} minWidth 最小列宽
 * @property {String} value 列绑定的字段名
 */
export default {
  name: 'SwitchColumn',
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
    return {
      key: false
    }
  },
  methods: {
    onChange(row) {
      row.changed = 1
      const type = typeof row[this.value]
      if (type === 'boolean') {
        row[this.value] = !row[this.value]
      } else if (type === 'number') {
        row[this.value] = row[this.value] === 0 ? 1 : 0
      }
    }
  }
}
</script>

