<template>
  <el-dialog v-el-drag-dialog title="修改材质参数" top="10vh" :visible.sync="visible">
    <div slot="title" class="dialog-footer">
      <div class="selected-condition">
        <div>修改材质参数</div>
        <span>目标ID：</span>
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
    <el-form ref="dataForm" :rules="rules" :model="dialogFormVal" label-position="left" label-width="80px" class="dialog-form">
      <el-checkbox-group
        v-model="paramsCheckboxVal"
      >
        <div class="dialog-size-item">
          <el-checkbox class="dialog-checkbox" :label="0">{{ }}</el-checkbox>
          <el-form-item class="dialog-form-item" label="贴图长宽">
            <div class="dialog-size-input-block">
              <el-form-item class="dialog-size-input" prop="u">
                <el-input v-model="dialogFormVal.u" :disabled="paramsCheckboxVal.indexOf(0)===-1" />
              </el-form-item>
              <div class="size-divide">X</div>
              <el-form-item class="dialog-size-input" prop="v">
                <el-input v-model="dialogFormVal.v" :disabled="paramsCheckboxVal.indexOf(0)===-1" />
              </el-form-item>
            </div>
          </el-form-item>
        </div>
        <div class="dialog-item">
          <el-checkbox class="dialog-checkbox" :label="1">{{ }}</el-checkbox>
          <el-form-item class="dialog-form-item" label="透明度" prop="alfa_val">
            <el-input v-model="dialogFormVal.alfa_val" :disabled="paramsCheckboxVal.indexOf(1)===-1" />
          </el-form-item>
        </div>
        <div class="dialog-item">
          <el-checkbox class="dialog-checkbox" :label="2">{{ }}</el-checkbox>
          <el-form-item class="dialog-form-item" label="反射度" prop="reflect_val">
            <el-input v-model="dialogFormVal.reflect_val" :disabled="paramsCheckboxVal.indexOf(2)===-1" />
          </el-form-item>
        </div>
        <div class="dialog-item">
          <el-checkbox class="dialog-checkbox" :label="3">{{ }}</el-checkbox>
          <el-form-item class="dialog-form-item" label="贴图亮度" prop="diffuse_val">
            <el-input v-model="dialogFormVal.diffuse_val" :disabled="paramsCheckboxVal.indexOf(3)===-1" />
          </el-form-item>
        </div>
        <div class="dialog-item">
          <el-checkbox class="dialog-checkbox" :label="4">{{ }}</el-checkbox>
          <el-form-item class="dialog-form-item" label="渗透度" prop="color_blend_factor">
            <el-input v-model="dialogFormVal.color_blend_factor" :disabled="paramsCheckboxVal.indexOf(4)===-1" />
          </el-form-item>
        </div>
        <div class="dialog-item">
          <el-checkbox class="dialog-checkbox" :label="5">{{ }}</el-checkbox>
          <el-form-item class="dialog-form-item" label="粗糙度" prop="roughness">
            <el-input v-model="dialogFormVal.roughness" :disabled="paramsCheckboxVal.indexOf(5)===-1" />
          </el-form-item>
        </div>
        <div class="dialog-item">
          <el-checkbox class="dialog-checkbox" :label="6">{{ }}</el-checkbox>
          <el-form-item class="dialog-form-item" label="高光亮度" prop="gloss_val">
            <el-input v-model="dialogFormVal.gloss_val" :disabled="paramsCheckboxVal.indexOf(6)===-1" />
          </el-form-item>
        </div>
        <div class="dialog-item">
          <el-checkbox class="dialog-checkbox" :label="7">{{ }}</el-checkbox>
          <el-form-item class="dialog-form-item" label="高光范围" prop="gloss_size_val">
            <el-input v-model="dialogFormVal.gloss_size_val" :disabled="paramsCheckboxVal.indexOf(7)===-1" />
          </el-form-item>
        </div>
        <div class="dialog-item">
          <el-checkbox class="dialog-checkbox" :label="8">{{ }}</el-checkbox>
          <el-form-item class="dialog-form-item" label="凹凸程度" prop="bump_val">
            <el-input v-model="dialogFormVal.bump_val" :disabled="paramsCheckboxVal.indexOf(8)===-1" />
          </el-form-item>
        </div>
        <div class="dialog-item">
          <el-checkbox class="dialog-checkbox" :label="9">{{ }}</el-checkbox>
          <el-form-item class="dialog-form-item" label="透光度" prop="diffuse_alpha_val">
            <el-input v-model="dialogFormVal.diffuse_alpha_val" :disabled="paramsCheckboxVal.indexOf(9)===-1" />
          </el-form-item>
        </div>
      </el-checkbox-group>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <div class="dialog-checkbox-control">
        <el-button type="primary" icon="el-icon-check" circle @click="paramsCheckboxVal=[0,1,2,3,4,5,6,7,8,9]" />
        <el-button type="primary" icon="el-icon-close" circle @click="paramsCheckboxVal=[]" />
      </div>
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
 * @property {Boolean} dialogVisible 对话框显示与否
 * @property {Array} materialCheckboxVal 当前选择的材质数组
 * @property {Array} tableData 当前表单的数据数组
 * @property {String} searchTarget 搜索时对应的匹配字段
 * @function closeDialog 通知父组件关闭对话框
 * @function returnMaterial 返回与tableData同类型的数组，对象包括id和修改的参数
 */
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
export default {
  name: 'MaterialDialog',
  directives: { elDragDialog },
  props: {
    dialogVisible: {
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
    searchTarget: {
      require: true,
      type: String,
      default: 'name'
    }
  },
  data() {
    const validateFunCanNull = (rule, value, callback) => {
      if (value) {
        const reg = /^-?\d+\.?\d*$/
        if (reg.test(value)) {
          callback()
        } else {
          callback(new Error('请输入数字'))
        }
      } else {
        callback()
      }
    }
    return {
      visible: false,
      key: 0,
      dialogFormVal: {}, // 修改的数据
      dialogFormValDefault: {
        u: '100',
        v: '100',
        alfa_val: 0,
        reflect_val: 0,
        diffuse_val: 1,
        color_blend_factor: 0.02,
        roughness: 0.5,
        gloss_val: 0,
        gloss_size_val: 0,
        bump_val: 0,
        diffuse_alpha_val: 0
      },
      rules: {
        u: [{ trigger: 'change', validator: validateFunCanNull }],
        v: [{ trigger: 'change', validator: validateFunCanNull }],
        alfa_val: [{ trigger: 'change', validator: validateFunCanNull }],
        reflect_val: [{ trigger: 'change', validator: validateFunCanNull }],
        diffuse_val: [{ trigger: 'change', validator: validateFunCanNull }],
        color_blend_factor: [{ trigger: 'change', validator: validateFunCanNull }],
        roughness: [{ trigger: 'change', validator: validateFunCanNull }],
        gloss_val: [{ trigger: 'change', validator: validateFunCanNull }],
        gloss_size_val: [{ trigger: 'change', validator: validateFunCanNull }],
        bump_val: [{ trigger: 'change', validator: validateFunCanNull }],
        diffuse_alpha_val: [{ trigger: 'change', validator: validateFunCanNull }]
      },
      paramsCheckboxVal: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] // 需修改参数
    }
  },
  watch: {
    dialogVisible: {
      immediate: true,
      handler(val) {
        this.visible = val
        if (val) {
          this.initData()
        }
      }
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
    setVisible() {
      this.$emit('closeDialog')
      // this.key++
    },
    initData() {
      this.paramsCheckboxVal = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
      if (this.materialCheckboxVal.length === 1) {
        const { u, v, alfa_val, reflect_val, diffuse_val, color_blend_factor, roughness, gloss_val, gloss_size_val, bump_val, diffuse_alpha_val } = this.materialCheckboxVal[0]
        this.dialogFormVal = { u, v, alfa_val, reflect_val, diffuse_val, color_blend_factor, roughness, gloss_val, gloss_size_val, bump_val, diffuse_alpha_val }
      } else {
        let num = 0
        this.dialogFormVal = Object.assign({}, this.dialogFormValDefault)
        for (const key in this.dialogFormValDefault) {
          for (let index = 0; index < this.materialCheckboxVal.length - 1; index++) {
            if (this.materialCheckboxVal[index][key] !== this.materialCheckboxVal[index + 1][key]) {
              if (key === 'u' || key === 'v') {
                this.paramsCheckboxVal.splice(0, 1)
              } else {
                this.paramsCheckboxVal.splice(this.paramsCheckboxVal.indexOf(num - 1), 1)
              }
              this.dialogFormVal[key] = this.dialogFormValDefault[key]
              break
            } else {
              this.dialogFormVal[key] = this.materialCheckboxVal[index][key]
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
      this.materialCheckboxVal.splice(index, 1)
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
              if (item === 'mat_type_id' && this.dialogFormVal[item]) {
                resObj[item] = Number(this.dialogFormVal[item])
              } else {
                resObj[item] = this.dialogFormVal[item]
              }
            }
          }
          const resArr = []
          for (const item of this.materialCheckboxVal) {
            const tempObj = JSON.parse(JSON.stringify(resObj))
            tempObj.id = item.id
            resArr.push(tempObj)
          }
          this.setVisible()
          this.$emit('returnMaterial', resArr)
        }
      })
    }
  }
}
</script>

<style>
.radio-menu .radio-menu-item{
  margin-right: 5px;
}
.radio-menu .el-radio.radio-menu-item.is-bordered{
  margin-left: 0;
}
.dialog-form-item .el-form-item__label{
  padding: 0;
}
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
</style>
