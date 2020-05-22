<template>
  <div class="brands-filter">
    <div class="brands-filter-name">品牌</div>
    <el-checkbox-group v-if="brands.length>=1" v-model="brandCheckboxVal" fill="#409EFF" :min="1" class="brands-filter-container">
      <el-checkbox v-for="(item,index) in brands" :key="index" :label="item.key">{{ item.name }}</el-checkbox>
    </el-checkbox-group>
    <div v-else class="brands-filter-container no-permission">
      <span>尚无权限</span>
    </div>
  </div>
</template>

<script type="text/javascript">
/**
 * @function selectBrands 返回对象{check:array,all:boolean},check为所选品牌key的数组，all为是否已全选
 */
export default {
  name: 'BrandsFilter',
  data() {
    return {
      brandCheckboxVal: []
    }
  },
  computed: {
    brands() {
      return this.$store.getters.brands
    }
  },
  watch: {
    brandCheckboxVal(val) {
      const length = this.brands.length
      const res = { check: val, all: false }
      if (val.length === length) {
        res.all = true
      }
      this.$emit('selectBrands', res)
    }
  },
  mounted() {
    this.brandCheckboxVal = []
    for (const item of this.brands) {
      this.brandCheckboxVal.push(item.key)
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
  padding-right: 10px;
  margin-left: 110px;

  &.no-permission{
    color: #909399;

    span{
      margin-left: 7px;
    }
  }
}
</style>
