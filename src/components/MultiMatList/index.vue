<template>
  <div>
    <el-tag v-for="(o, i) in data" :key="i" closable style="width:280px" @close="onDeleteMat(i)">
      <router-link target="_blank" :to="{path:'/material/material', query:{dir1:o.mat_dir1,dir2:o.mat_dir2,name:o.mat_name}}">
        {{ o.mat_dir1 + '\\' + o.mat_dir2 + '\\' + o.mat_name }}
      </router-link>
    </el-tag>
    <el-button-group>
      <el-tooltip content="复制">
        <el-button type="primary" icon="el-icon-caret-left" size="mini" @click="onCopy" />
      </el-tooltip>
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="onAddMat" />
      <el-tooltip content="粘贴">
        <el-button type="primary" icon="el-icon-caret-right" size="mini" @click="onPaste" />
      </el-tooltip>
    </el-button-group>
    <el-dialog title="选择材料" :visible.sync="dialogFormVisible" width="90%" height="90%" style="z-index:999999">
      <material-select @cancel="dialogFormVisible=false" @selectMat="onSelectMat" @selectDir1="onSelectDir1" @selectDir2="onSelectDir2" />
    </el-dialog>
  </div>
</template>

<script type="text/javascript">

import MaterialSelect from '@/components/MaterialSelect'

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
    matList: {
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
      copyList: []
    }
  },
  computed: {
  },
  methods: {
    onDeleteMat(index) {
      this.data.splice(index, 1)
    },
    onAddMat() {
      this.dialogFormVisible = true
    },
    onCopy() {
      this.$emit('onCopy', this.data)
      this.$message.copyOk()
    },
    onPaste() {
      this.data.splice(0, this.data.length)
      const data = this.matList
      data.forEach(el => {
        this.data.push({ 'mat_dir1': el.mat_dir1, 'mat_dir2': el.mat_dir2, 'mat_name': el.mat_name })
      })
      this.$message.pasteOk()
    },
    onSelectMat(data) {
      this.dialogFormVisible = false
      data.forEach(el => {
        this.data.push({ 'mat_dir1': el.use_group, 'mat_dir2': el.texture_group, 'mat_name': el.name })
      })
    },
    onSelectDir1(dir1) {
      this.dialogFormVisible = false
      this.data.push({ 'mat_dir1': dir1, 'mat_dir2': '', 'mat_name': '' })
    },
    onSelectDir2(dir1, dir2) {
      this.dialogFormVisible = false
      this.data.push({ 'mat_dir1': dir1, 'mat_dir2': dir2, 'mat_name': '' })
    }
  }
}
</script>
