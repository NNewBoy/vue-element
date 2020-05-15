<template>
  <div class="brands-filter">
    <div class="brands-filter-name">上架状态</div>
    <el-checkbox-group v-model="brandCheckboxVal" fill="#409EFF" :min="1" class="brands-filter-container">
      <el-checkbox v-for="(item,index) in statusList" :key="index" :label="item.value">{{ item.text }}</el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script type="text/javascript">
/**
 * @function selectStatus 返回对象{check:array,all:boolean},check为所选状态value的数组，all为是否已全选
 */
export default {
  name: 'StatusCheckbox',
  data() {
    return {
      brandCheckboxVal: [],
      statusList: [
        { value: 0, text: '隐藏' },
        { value: 1, text: '上架' },
        { value: 2, text: '下架' }
      ]
    }
  },
  watch: {
    brandCheckboxVal(val) {
      const length = this.statusList.length
      const res = { check: val, all: false }
      if (val.length === length) {
        res.all = true
      }
      this.$emit('selectStatus', res)
    }
  },
  mounted() {
    this.brandCheckboxVal = []
    for (const item of this.statusList) {
      this.brandCheckboxVal.push(item.value)
    }
  }
}
</script>
<style>
.brands-filter .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
  background-color: #1890ff;
  border-color: #1890ff;
}
.brands-filter .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
  border-color: #fff;
}
.brands-filter .el-checkbox__input.is-disabled+span.el-checkbox__label {
  color: #1890ff;
  cursor: not-allowed;
}
</style>
<style lang="scss" scoped>
.brands-filter{
  border-bottom: 1px dashed #eee;
  padding: 6px 0;
}
.brands-filter-name{
  float: left;
  padding-left: 10px;
  max-width: 110px;
}
.brands-filter-container{
  position: relative;
  overflow: hidden;
  padding-left: 10px;
  padding-right: 160px;
  margin-left: 110px;

  &.no-permission{
    color: #909399;

    span{
      margin-left: 7px;
    }
  }
}
</style>
