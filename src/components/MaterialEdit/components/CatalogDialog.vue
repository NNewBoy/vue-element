<template>
  <el-dialog :key="key" v-el-drag-dialog class="dialog-container" top="10vh" title="修改材质目录" :visible.sync="visible">
    <div slot="title" class="dialog-footer">
      <div class="selected-condition">
        <div>移动材质目录</div>
        <span>目标：</span>
        <a
          v-for="(item, index) in materialCheckboxVal"
          :key="index"
          href="javascript:;"
          @click="deleteMaterialItem(index)"
        >
          <i class="el-icon-check" />{{ item[searchTarget] }}
        </a>
      </div>
    </div>

    <div class="catalog-border">
      <div class="catalog-title">当前目录：</div>
      <el-breadcrumb class="catalog-content" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="(item,index) in fromCatalog" :key="index">{{ item }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="catalog-border">
      <div class="catalog-title">目标目录：</div>
      <el-breadcrumb class="catalog-content" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="(item,index) in cascaderVal" :key="index">{{ item }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <MultiFilter
      :datas="cascaderDatas"
      :levels="searchTarget==='door_color'?3:2"
      :filter-names="searchTarget==='door_color'?['门板系列','门板价格','门板造型']:['材质分类','材质系列']"
      :multi-choices="searchTarget==='door_color'?[true,true,false]:[true,false]"
      @getResult="getResult"
    />

    <div slot="footer" class="dialog-footer">
      <el-button @click="clickCancel">
        取消
      </el-button>
      <el-button type="primary" @click="updateData">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script type="text/javascript">
/**
 * @property {Boolean} catalogDialogVisible 对话框显示与否
 * @property {Array} materialCheckboxVal 当前选择的材质数组
 * @property {Array} tableData 当前表单的数据数组
 * @property {Array} fromCatalog 当前选中的目录数组
 * @property {Array} cascaderDatas 当前目录的数据数组
 * @property {String} searchTarget 搜索时对应的匹配字段，用于判断是材质库或门板库
 * @function closeCatalogDialog 通知父组件关闭对话框
 * @function returnCatalog 返回目录转移数据{id,from,to}，id为选择的材质id数组，from为当前目录数组，to为目标目录数组
 */
import MultiFilter from '@/components/MultiFilter'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
export default {
  components: { MultiFilter },
  directives: { elDragDialog },
  props: {
    catalogDialogVisible: {
      require: true,
      type: Boolean,
      default: false
    },
    materialCheckboxVal: {
      require: true,
      type: Array,
      default() {
        return []
      }
    },
    tableData: {
      require: true,
      type: Array,
      default() {
        return []
      }
    },
    fromCatalog: {
      require: true,
      type: Array,
      default() {
        return []
      }
    },
    cascaderDatas: {
      require: true,
      type: Array,
      default() {
        return []
      }
    },
    searchTarget: {
      require: true,
      type: String,
      default: 'name'
    }
  },
  data() {
    return {
      cascaderVal: [], // 目标目录
      visible: false,
      key: 0
    }
  },
  watch: {
    catalogDialogVisible(val) {
      this.visible = val
    },
    visible(val) {
      if (!val) {
        this.setVisible()
      }
    },
    materialCheckboxVal(val) {
      if (val.length === 0) {
        this.visible = false
      }
    }
  },
  methods: {
    getResult(arr) {
      if (arr.length > 0) {
        this.cascaderVal = arr[0].map(item => item.name)
      } else {
        this.cascaderVal = []
      }
    },
    setVisible() {
      this.$emit('closeCatalogDialog')
      this.key++
    },
    deleteMaterialItem(index) {
      this.materialCheckboxVal.splice(index, 1)
    },
    clickCancel() {
      this.visible = false
      this.setVisible()
    },
    updateData() {
      this.visible = false
      if (this.cascaderVal.length === 0) {
        this.setVisible()
        return
      }
      const resId = []
      for (const item of this.materialCheckboxVal) {
        resId.push(item.id)
      }
      this.setVisible()
      this.$emit('returnCatalog', { id: resId, from: this.fromCatalog, to: this.cascaderVal })
    }
  }
}
</script>

<style>
.dialog-container .el-dialog{
  margin-bottom: 10vh;
}
</style>
<style lang="scss" scoped>
.selected-condition{
  font-size: 14px;
  line-height: 24px;
  padding-bottom: 6px;

  a{
    display: inline-block;
    margin: 0 5px;
  }
  i{
    border: 1px solid #e4393c;
    color: #e4393c;
  }
}
.catalog-border{
  display: flex;
  align-items: center;
}
.catalog-border:first-child{
  margin-bottom: 30px;
}
.catalog-title{
  display: inline-block;
  height: 40px;
  line-height: 40px;
}
.catalog-content{
  display: inline-block;
  height: 40px;
  line-height: 40px;
}
</style>
