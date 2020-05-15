<template>
  <div class="app-container">
    <el-table-column v-for="(o, i) in materialList" :key="i" align="center" :label="o.text" width="150">
      <template slot-scope="{row}">
        <el-input v-model="row[o.value]" class="input-one" size="small" placeholder="请输入内容" @change="onChange(row)" />
        <span>{{ row[o.value] }}</span>
      </template>
    </el-table-column>
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
    <el-table-column label="是否可以喷绘" width="120" align="center">
      <template slot-scope="{row}">
        <el-select v-model="row.permit_paint" @change="row.editStatus=1">
          <el-option
            v-for="(o, i) in paintList"
            :key="i"
            :label="o.text"
            :value="o.value"
          />
        </el-select>
        <span>{{ row.permit_paint | paintFilter }}</span>
      </template>
    </el-table-column>
  </div>
</template>

<script type="text/javascript">

export default {
  name: 'MaterialPictureColumn',
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
    },
    paintFilter: function(val) {
      switch (val) {
        case 0:
          return '否'
        case 1:
          return '是'
        default:
          return '未知:' + val
      }
    }
  },
  props: {
  },
  data() {
    return {
      materialList: [
        { value: 'mat_type_name', text: '云渲染材质名' },
        { value: 'mat_type_id', text: '云渲染材质id' }
      ],
      dirList: [
        { value: 0, text: '竖向' },
        { value: 1, text: '横向' }
      ],
      paintList: [
        { value: 0, text: '否' },
        { value: 1, text: '是' }
      ]
    }
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
