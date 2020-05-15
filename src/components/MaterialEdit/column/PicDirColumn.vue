<template>
  <div class="app-container">
    <el-table-column label="贴图纹理方向" width="120" align="center">
      <template slot-scope="{row}">
        <el-select v-model="row.pic_file_texture_dir" @change="row.editStatus=1">
          <el-option
            v-for="(o, i) in dirList"
            :key="i"
            :label="o.text"
            :value="o.value"
          />
        </el-select>
        <span>{{ row.pic_file_texture_dir | dirFilter }}</span>
      </template>
    </el-table-column>
  </div>
</template>

<script type="text/javascript">

export default {
  name: 'PicDirColumn',
  filters: {
    dirFilter: function(val) {
      switch (val) {
        case 0:
          return '竖向'
        case 1:
          return '横向'
        default:
          return '未知:' + val
      }
    }
  },
  props: {

  },
  data() {
    return {
      dirList: [
        { value: 0, text: '竖向' },
        { value: 1, text: '横向' }
      ]
    }
  },
  computed: {
  },
  created() {
  },
  methods: {
    setEditStatus(row) {
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
