<template>
  <vxe-modal
    :key="modelKey"
    v-model="visible"
    esc-closable
    resize
    show-footer
    width="60vw"
    min-height="50vh"
    class="dialog-container"
    :title="title"
  >
    <div class="dialog-footer">
      <div class="selected-condition">
        <span>目标ID：</span>
        <a
          v-for="(item, index) in selectedFormVal"
          :key="index"
          href="javascript:;"
          @click="deleteMaterialItem(index)"
        >
          <i class="el-icon-check" />{{ item[searchTarget] }}
        </a>
      </div>
    </div>
    <el-form ref="dataForm" :key="formKey" :rules="rules" :model="dialogFormVal" label-position="left" :label-width="labelWidth" class="dialog-form">
      <el-checkbox-group
        v-model="paramsCheckboxVal"
      >
        <el-row>
          <el-col v-for="(item,index) in dialogFormValDefault" :key="'df'+index" :span="item.span">
            <el-checkbox class="dialog-checkbox" :label="index">{{ }}</el-checkbox>
            <el-form-item class="dialog-form-item" :label="item.name" :prop="item.key">
              <div v-if="item.type==='input'">
                <vxe-input v-model="dialogFormVal[item.key]" :type="item.inputType" :min="item.min" :max="item.max" :disabled="paramsCheckboxVal.indexOf(index)===-1" />
              </div>
              <div v-else-if="item.type==='select'">
                <el-select v-model="dialogFormVal[item.key]" placeholder="请选择">
                  <el-option
                    v-for="opt in item.options"
                    :key="opt[item.optionProps.value]"
                    :value="opt[item.optionProps.value]"
                    :label="opt[item.optionProps.label]"
                  />
                </el-select>
              </div>
              <div v-else-if="item.type==='switch'">
                <el-switch v-model="dialogFormVal[item.key]" :active-value="1" :inactive-value="0" />
              </div>
              <div v-else-if="item.type==='dialog'">
                <vxe-button @click="onShow(item.options,item.optionProps,item.key,dialogFormVal[item.key])">{{ getDialogText(item.options,item.optionProps,dialogFormVal[item.key]) }}</vxe-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-checkbox-group>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <div class="dialog-checkbox-control">
        <el-button type="primary" icon="el-icon-check" circle @click="setParamsCheckbox" />
        <el-button type="primary" icon="el-icon-close" circle @click="paramsCheckboxVal=[]" />
      </div>
      <el-button @click="clickCancel">
        取消
      </el-button>
      <el-button type="primary" @click="updateData">
        确定
      </el-button>
    </div>

    <SelectDialog
      title="请选择"
      :dialog-visible="dialogSelected.visible"
      :table-data="dialogSelected.selection"
      :selected="dialogSelected.selected"
      @closeSelectDialog="dialogSelected.visible = false"
      @getSelected="changeParams"
    />
  </vxe-modal>
</template>

<script type="text/javascript">
/**
 * @property {String} title 对话框标题
 * @property {String} labelWidth 表单标签宽度，如80px，支持auto
 * @property {Boolean} dialogVisible 对话框显示与否
 * @property {Array} selectedFormVal 当前选择的材质的所有参数的对象数组
 * @property {Array} dialogFormValDefault 表单默认数据[name,key,value,span}],name名称,key字段名,value值,span栅格跨度
 * @property {Object} rules 表单的验证规则
 * @property {String} searchTarget 搜索时对应的匹配字段,用于显示选中的选项
 * @function closeDialog 通知父组件关闭对话框
 * @function returnDialogForm 返回与selectedFormVal同类型的数组，对象包括id和修改的参数
 */
import SelectDialog from '@/components/MaterialEdit/dialog/VxeSelectDialog'
export default {
  name: 'VxeCommonDialog',
  components: { SelectDialog },
  props: {
    title: {
      require: false,
      type: String,
      default: ''
    },
    labelWidth: {
      require: false,
      type: String,
      default: 'auto'
    },
    dialogVisible: {
      require: true,
      type: Boolean,
      default: false
    },
    selectedFormVal: {
      require: true,
      type: Array,
      default() {
        return []
      }
    },
    dialogFormValDefault: {
      require: true,
      type: Array,
      default() {
        return [{ name: '', key: '', value: '', span: '6', type: 'input' }]
      }
    },
    rules: {
      require: true,
      type: Object,
      default() {
        return {}
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
      visible: false,
      modelKey: 0,
      formKey: 0,
      dialogFormVal: {
        product_type: -1,
        change_size: 1,
        direction: 0,
        brand: '',
        model_path: '',
        pic: ''
      }, // 修改的数据
      paramsCheckboxVal: [], // 需修改参数
      dialogSelected: {
        selection: [],
        selected: '',
        visible: false
      } // 弹窗数据
    }
  },
  watch: {
    dialogVisible: {
      immediate: true,
      handler(val) {
        this.visible = val
        if (val) {
          this.dialogFormVal = {}
          this.initData()
        }
      }
    },
    visible(val) {
      if (!val) {
        this.setVisible()
      }
    },
    selectedFormVal(val) {
      if (val.length === 0) {
        this.visible = false
      }
    }
  },
  methods: {
    changeParams(res) {
      this.dialogFormVal[this.dialogSelected.target] = res.key
    },
    onShow(options, optionProps, key, value) {
      this.dialogSelected.target = key
      this.dialogSelected.selection = options
      this.dialogSelected.selected = this.getDialogText(options, optionProps, value)
      this.dialogSelected.visible = true
    },
    getDialogText(options, optionProps, value) {
      const res = options.find((val) => val[optionProps.value] === value)
      return res[optionProps.label]
    },
    setVisible() {
      this.$emit('closeDialog')
      // this.modelKey++
    },
    setParamsCheckbox() {
      this.paramsCheckboxVal = []
      for (const index in this.dialogFormValDefault) {
        this.paramsCheckboxVal.push(Number(index))
      }
    },
    setDialogForm() {
      for (const item of this.dialogFormValDefault) {
        this.$set(this.dialogFormVal, item.key, this.selectedFormVal[0][item.key])
      }
    },
    setDialogFormDefault() {
      for (const item of this.dialogFormValDefault) {
        this.$set(this.dialogFormVal, item.key, item.value)
      }
    },
    initData() {
      this.setParamsCheckbox()
      if (this.selectedFormVal.length === 1) {
        this.setDialogForm()
      } else {
        let num = 0
        this.setDialogForm()
        for (const item of this.dialogFormValDefault) {
          for (let index = 0; index < this.selectedFormVal.length - 1; index++) {
            if (this.selectedFormVal[index][item.key] !== this.selectedFormVal[index + 1][item.key]) {
              this.paramsCheckboxVal.splice(this.paramsCheckboxVal.indexOf(num), 1)
              this.dialogFormVal[item.key] = this.dialogFormValDefault.find(el => el.key === item.key).value
              break
            }
          }
          num++
        }
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].$el.scrollTop = 0
        this.$refs['dataForm'].clearValidate()
      })
    },
    deleteMaterialItem(index) {
      this.selectedFormVal.splice(index, 1)
    },
    clickCancel() {
      this.visible = false
      this.setVisible()
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.visible = false
          if (this.paramsCheckboxVal.length === 0) {
            this.setVisible()
            return
          }
          const resObj = {}
          const order = Object.keys(this.dialogFormVal)
          for (const item in this.dialogFormVal) {
            if (this.paramsCheckboxVal.indexOf(order.indexOf(item)) !== -1) {
              resObj[item] = this.dialogFormVal[item]
            }
          }
          for (const item of this.selectedFormVal) {
            for (const key in resObj) {
              item[key] = resObj[key]
            }
          }
          this.setVisible()
        }
      })
    }
  }
}
</script>

<style>
.dialog-form-item .el-form-item__label{
  padding: 0;
}
.el-checkbox.dialog-checkbox .el-checkbox__label{
  padding:0;
}
</style>
<style lang="scss" scoped>
.menu-list{
  display: flex;
  align-items: center;
}
.menu-item{
  display: flex;
  align-items: center;
  margin-right: 20px;
}
.material-box{
  text-align: center;
}
.brand-box{
  display: inline-block;
  margin-right: 5px;
}
.brand-button{
  display: inline-block;
}
.header-a-border{
  display: flex;
  justify-content: center;
  align-items: center;
}
.dialog-form{
  max-height: 50vh;
  overflow: auto;
}
.dialog-size-item{
  display: block;
  margin-left: 25px;

  .dialog-size-input{
    display: inline-block;
    width: 95px;
  }
  .dialog-size-input-block{
    display: inline-block;
    position: relative;
    width: 221px;

    .dialog-size-input:last-child{
      position: absolute;
      right: 0;
    }
  }
}
.dialog-item{
  display: inline-block;
  width: 200px;
  margin-left: 25px;
}
.dialog-checkbox{
  float: left;
  line-height: 40px;
  width:25px;
  text-align: center;
}
.dialog-form-item{
  margin-left: 25px;
}
.size-divide{
  display: inline-block;
  width: 30px;
  text-align: center;
}
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
.dialog-checkbox-control{
  float: left;
}
.my-checkbox{
  white-space: nowrap;
  cursor: pointer;
  outline: none;
  display: inline-block;
  line-height: 1;
  position: relative;
  vertical-align: middle;

  &.is-checked{
    .my-checkbox-inner{
      background-color: #1890ff;
      border-color: #1890ff;
    }
  }

  .my-checkbox-inner{
    display: inline-block;
    position: relative;
    border: 1px solid #DCDFE6;
    border-radius: 2px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 14px;
    height: 14px;
    background-color: #fff;
    z-index: 1;
    transition: border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46),background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);

    &:after{
      height: 6px;
      width: 2px;
      box-sizing: content-box;
      content: "";
      border: 1px solid #fff;
      border-left: 0;
      border-top: 0;
      left: 4px;
      position: absolute;
      top: 1px;
      transform: rotate(45deg) scaleY(1);
      transition: transform .15s ease-in .05s, -webkit-transform .15s ease-in .05s;
      transform-origin: center;
    }
  }

  .select-all{
    margin-right: 10px;
    background-color: rgb(160, 207, 255);
    color: white;
    border: 1px solid rgb(160, 207, 255);
    border-radius: 2px;

    &:hover{
      border: 1px solid #46a6ff;
      background-color: #46a6ff;
    }
  }
}
.vxe-input{
  width:100%
}
</style>
