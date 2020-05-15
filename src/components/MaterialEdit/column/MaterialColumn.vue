<template>
  <div class="app-container">
    <el-table-column v-for="(o, i) in materialList" :key="i" align="center" :label="o.text" width="100">
      <template slot-scope="{row}">
        <el-input v-model="row[o.value]" class="input-one" size="small" placeholder="请输入内容" @input="onInput(row,o.value)" @change="onChange(row,o.value)" />
        <span>{{ row[o.value] }}</span>
      </template>
    </el-table-column>
  </div>
</template>

<script type="text/javascript">

export default {
  name: 'MaterialColumn',
  props: {
  },
  data() {
    return {
      materialList: [
        { value: 'u', text: '贴图长' },
        { value: 'v', text: '贴图宽' },
        { value: 'alfa_val', text: '透明度' },
        { value: 'reflect_val', text: '反射度' },
        { value: 'diffuse_val', text: '贴图亮度' },
        { value: 'color_blend_factor', text: '渗透度' },
        { value: 'roughness', text: '粗糙度' },
        { value: 'gloss_val', text: '高光亮度' },
        { value: 'gloss_size_val', text: '高光范围' },
        { value: 'bump_val', text: '凹凸程度' },
        { value: 'diffuse_alpha_val', text: '透光度' }
      ]
    }
  },
  methods: {
    onInput(row, value) {
      row.editStatus = 1
      row[value] = this.toNumber(row[value])
    },
    onChange(row, value) { // 数据类型格式化
      if (value !== 'u' && value !== 'v') {
        row[value] = Number(row[value])
      }
    },
    toNumber(num) {
      // 得到第一个字符是否为负号
      var t = num.charAt(0)
      // 先把非数字的都替换掉，除了数字和.
      num = num.replace(/[^\d\.]/g, '')
      // 必须保证第一个为数字而不是.
      num = num.replace(/^\./g, '')
      // 保证只有出现一个.而没有多个.
      num = num.replace(/\.{2,}/g, '.')
      // 保证.只出现一次，而不能出现两次以上
      num = num.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
      // 如果第一位是负号，则允许添加
      if (t === '-') {
        num = '-' + num
      }
      return num
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
