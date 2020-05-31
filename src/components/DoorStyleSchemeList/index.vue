<template>
  <div>
    <el-tag v-for="(o, i) in data" :key="i" closable style="width:280px" @close="onDelete(i)" @click.native="onSel(o)">
      {{ o.id + ': ' + o.name }}
    </el-tag>
    <el-button-group>
      <el-tooltip content="复制">
        <el-button type="primary" icon="el-icon-caret-left" size="mini" @click="onCopy" />
      </el-tooltip>
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="onAdd" />
      <el-tooltip content="粘贴">
        <el-button type="primary" icon="el-icon-caret-right" size="mini" @click="onPaste" />
      </el-tooltip>
    </el-button-group>
    <el-dialog title="选择门板方案" :visible.sync="dialogFormVisible" width="90%" height="90%" style="z-index:999999">
      <door-style-scheme-select :search-text="schemeId" @select="onSelectScheme" />
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import DoorStyleSchemeSelect from '@/components/DoorStyleSchemeSelect'
import { copyToClipboard, pasteFromClipboard } from '@/utils/clipboard'

export default {
  name: 'DoorStyleSchemeList',
  components: { DoorStyleSchemeSelect },
  props: {
    data: {
      require: true,
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      selected: null,
      schemeId: null
    }
  },
  computed: {
  },
  methods: {
    onDelete(index) {
      this.data.splice(index, 1)
    },
    onSel(row) {
      this.selected = row
      this.schemeId = row.id
      this.dialogFormVisible = true
    },
    onAdd() {
      this.selected = null
      this.schemeId = null
      this.dialogFormVisible = true
    },
    onCopy() {
      copyToClipboard('doorstyle_scheme_list', this.data)
    },
    onPaste() {
      const data = pasteFromClipboard('doorstyle_scheme_list')
      if (data !== null) {
        this.data.splice(0, this.data.length)
        data.forEach(el => {
          this.data.push({ id: el.id, name: el.name, mode: el.mode })
        })
      }
    },
    onSelectScheme(scheme) {
      this.dialogFormVisible = false
      if (this.selected) {
        this.selected.id = scheme.id
        this.selected.name = scheme.name
      } else {
        this.data.push({ id: scheme.id, name: scheme.name })
      }
    }
  }
}
</script>
