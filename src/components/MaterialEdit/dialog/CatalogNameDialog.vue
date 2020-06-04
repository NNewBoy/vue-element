<template>
  <el-dialog :key="key" v-el-drag-dialog class="dialog-container" title="编辑目录名称" :visible.sync="visible">
    <el-dialog
      title="选择目录"
      :visible.sync="innerVisible"
      append-to-body
    >
      <MultiFilter
        :datas="cascaderDatas"
        :filter-names="searchTarget==='door_color'?['门板系列','门板价格','门板造型']:['材质分类','材质系列']"
        :multi-choices="searchTarget==='door_color'?[true,true,false]:[true,false]"
        @getResult="getResult"
      />
      <div class="catalog-border">
        <div class="catalog-title">当前选中目录：</div>
        <el-breadcrumb class="catalog-content" separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-for="(item,index) in selectedVal" :key="index">{{ item }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="innerVisible=false">
          取消
        </el-button>
        <el-button type="primary" @click="selectCatalog">
          确定
        </el-button>
      </div>
    </el-dialog>

    <div class="catalog-input-item">
      <div class="catalog-input-title">
        <span>目标目录：</span>
      </div>
      <a href="javascript:;" @click="innerVisible=true">
        <el-breadcrumb class="catalog-content-border" separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-for="(item,index) in cascaderVal" :key="index">{{ item }}</el-breadcrumb-item>
        </el-breadcrumb>
      </a>
    </div>
    <div v-if="cascaderVal.length>0" class="catalog-input-item">
      <div class="catalog-input-title">
        <span>修改目录名称：</span>
      </div>
      <el-form ref="dataForm" :rules="rules" :model="dialogFormVal">
        <el-form-item class="dialog-form-item" prop="changeVal">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item v-for="(item,index) in cascaderVal" :key="index">
              <el-input v-model="dialogFormVal.changeVal[index]" class="catalog-input" :placeholder="item" size="small" />
            </el-breadcrumb-item>
          </el-breadcrumb>
        </el-form-item>
      </el-form>

    </div>
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
 * @property {Boolean} catalogNameDialogVisible 对话框显示与否
 * @property {Array} cascaderDatas 当前目录的数据数组
 * @property {String} searchTarget 搜索时对应的匹配字段，用于判断是材质库或门板库
 * @function closeDialog 通知父组件关闭对话框
 * @function returnCatalogName 返回目录转移数据{id,from,to}，id为选择的材质id数组，from为当前目录数组，to为目标目录数组
 */
import MultiFilter from '@/components/MultiFilter'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
export default {
  name: 'CatalogNameDialog',
  components: { MultiFilter },
  directives: { elDragDialog },
  props: {
    catalogNameDialogVisible: {
      require: true,
      type: Boolean,
      default: false
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
    const validateFun = (rule, value, callback) => {
      if (value.length === this.cascaderVal.length) {
        for (const item of value) {
          if (!item) {
            callback(new Error('请输入目录名'))
          }
        }
        callback()
      } else {
        callback(new Error('请输入目录名'))
      }
    }
    return {
      selectedVal: [], // 选择器选中的临时目录
      cascaderVal: [], // 需修改的目录
      visible: false,
      innerVisible: false, // 内层dialog
      dialogFormVal: { // 修改后的目录
        changeVal: []
      },
      rules: {
        changeVal: [{ type: 'array', require: true, trigger: 'change', validator: validateFun }]
      },
      key: 0
    }
  },
  watch: {
    catalogNameDialogVisible(val) {
      this.visible = val
    },
    visible(val) {
      if (!val) {
        this.setVisible()
      } else {
        this.selectedVal = []
        this.cascaderVal = []
        this.dialogFormVal.changeVal = []
        this.innerVisible = false
      }
    },
    materialCheckboxVal(val) {
      if (val.length === 0) {
        this.visible = false
      }
    }
  },
  methods: {
    selectCatalog() {
      this.cascaderVal = [...this.selectedVal]
      this.innerVisible = false
    },
    getResult(arr) {
      if (arr.length > 0) {
        this.selectedVal = arr[0].map(item => item.name)
      } else {
        this.selectedVal = []
      }
    },
    setVisible() {
      this.$emit('closeDialog')
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
      if (this.cascaderVal.length === 0) {
        return
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.visible = false
          this.setVisible()
          this.$emit('returnCatalogName', { origin: this.cascaderVal, change: this.dialogFormVal.changeVal })
        }
      })
    }
  }
}
</script>

<style>
.dialog-container .el-dialog{
  margin-bottom: 10vh;
}
.dialog-form-item .el-breadcrumb__item{
  margin-bottom: 10px;
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
.catalog-content-border{
  display: inline-block;
  height: 32px;
  min-width: 250px;
  line-height: 32px;
  padding: 0 10px;
  border-radius: 4px;
  border: 1px solid #d7dae2;
  margin-bottom: 20px;

  &:hover{
    border-color: #1890ff;
  }
}
.catalog-input-title{
  position: relative;
  display: block;
  text-align: left;
  height: 40px;
  line-height: 40px;

  span{
    position: absolute;
    left: 0;
  }
}
.catalog-input{
  width: 150px;
}
</style>
