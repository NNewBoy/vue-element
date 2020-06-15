<template>
  <div class="app-container">
    <PlTableColumn :label="label" :width="width" :min-width="minWidth" align="center">
      <template slot-scope="{row}">
        <el-switch
          :value="Boolean(row[value])"
          @change="onChange(row)"
        />
      </template>
    </PlTableColumn>
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
import { PlTableColumn } from 'pl-table'
export default {
  name: 'SwitchColumn',
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

