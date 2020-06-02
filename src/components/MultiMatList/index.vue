<template>
  <div>
    <el-tag v-for="(o, i) in data" :key="i" closable style="width:280px" @close="onDeleteMat(i)" @click.native="onSelMat(o)">
      {{ o.mat_dir1 + '\\' + o.mat_dir2 + '\\' + o.mat_name }}
    </el-tag>
    <el-button-group>
      <el-tooltip content="复制">
        <el-button type="primary" icon="el-icon-document-copy" size="mini" @click="onCopy" />
      </el-tooltip>
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="onAddMat" />
      <el-tooltip content="粘贴">
        <el-button type="primary" icon="el-icon-document-add" size="mini" @click="onPaste" />
      </el-tooltip>
    </el-button-group>
    <el-dialog title="选择材料" :visible.sync="dialogFormVisible" width="90%" height="90%" style="z-index:999999" :center="false">
      <material-select :init-dir1="dir1" :init-dir2="dir2" :init-name="materialName" @cancel="dialogFormVisible=false" @selectMat="onSelectMat" @selectDir1="onSelectDir1" @selectDir2="onSelectDir2" />
    </el-dialog>
  </div>
</template>

<script type="text/javascript">

import MaterialSelect from '@/components/MaterialSelect'
import { copyToClipboard, pasteFromClipboard } from '@/utils/clipboard'

export default {
  name: 'MultiMatList',
  components: { MaterialSelect },
  props: {
    data: {
      require: true,
      type: Array,
      default() {
        return []
      }
    },
    vLoading: {
      require: true,
      type: Boolean,
      default: false
    },
    onChange: {
      require: false,
      type: Function,
      default: null
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      dir1: '',
      dir2: '',
      materialName: '',
      selected: null
    }
  },
  computed: {
  },
  methods: {
    onDeleteMat(index) {
      this.data.splice(index, 1)
      this.onChange && this.onChange()
    },
    onAddMat() {
      this.selected = null
      this.dir1 = ''
      this.dir2 = ''
      this.materialName = ''
      this.dialogFormVisible = true
    },
    onSelMat(row) {
      this.selected = row
      this.dir1 = row.mat_dir1
      this.dir2 = row.mat_dir2
      this.materialName = row.mat_name
      this.dialogFormVisible = true
    },
    onCopy() {
      copyToClipboard('mat_list', this.data)
    },
    onPaste() {
      const data = pasteFromClipboard('mat_list')
      if (data !== null) {
        this.data.splice(0, this.data.length)
        data.forEach(el => {
          this.data.push({ 'mat_dir1': el.mat_dir1, 'mat_dir2': el.mat_dir2, 'mat_name': el.mat_name })
        })
        this.onChange && this.onChange()
      }
    },
    onSelectMat(data) {
      this.dialogFormVisible = false
      if (this.selected) {
        this.selected.mat_dir1 = data[0].use_group
        this.selected.mat_dir2 = data[0].use_group
        this.selected.mat_name = data[0].name
      } else {
        data.forEach(el => {
          this.data.push({ mat_dir1: el.use_group, mat_dir2: el.texture_group, mat_name: el.name })
        })
      }
      this.onChange && this.onChange()
    },
    onSelectDir1(dir1) {
      this.dialogFormVisible = false
      if (this.selected) {
        this.selected.mat_dir1 = dir1
        this.selected.mat_dir2 = ''
        this.selected.mat_name = ''
      } else {
        this.data.push({ 'mat_dir1': dir1, 'mat_dir2': '', 'mat_name': '' })
      }
      this.onChange && this.onChange()
    },
    onSelectDir2(dir1, dir2) {
      this.dialogFormVisible = false
      if (this.selected) {
        this.selected.mat_dir1 = dir1
        this.selected.mat_dir2 = dir2
        this.selected.mat_name = ''
      } else {
        this.data.push({ 'mat_dir1': dir1, 'mat_dir2': dir2, 'mat_name': '' })
      }
      this.onChange && this.onChange()
    }
  }
}
</script>
