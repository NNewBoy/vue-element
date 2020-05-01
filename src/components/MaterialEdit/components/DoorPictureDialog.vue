<template>
  <el-dialog :key="key" v-el-drag-dialog class="dialog-container" top="10vh" title="修改材质参数" :visible.sync="visible">
    <div slot="title" class="dialog-footer">
      <div class="selected-condition">
        <div>修改贴图属性</div>
        <span>目标：</span>
        <a
          v-for="(item, index) in materialCheckboxVal"
          :key="index"
          href="javascript:;"
          @click="deleteMaterialItem(index)"
        >
          <i class="el-icon-check" />{{ tableData[item]['door_color'] }}
        </a>
      </div>
    </div>

    <el-form ref="dataForm" :rules="rules" :model="dialogFormVal" label-position="left" label-width="100px" class="dialog-form">
      <el-checkbox-group
        v-model="paramsCheckboxVal"
      >
        <div class="dialog-item">
          <el-checkbox class="dialog-checkbox" :label="0">{{ }}</el-checkbox>
          <el-form-item class="dialog-form-item" label="颜色名" prop="door_color">
            <el-input v-model="dialogFormVal.door_color" :disabled="paramsCheckboxVal.indexOf(0)===-1" />
          </el-form-item>
        </div>
        <div class="dialog-item">
          <el-checkbox class="dialog-checkbox" :label="1">{{ }}</el-checkbox>
          <el-form-item class="dialog-form-item" label="目录" prop="folder">
            <el-input v-model="dialogFormVal.folder " :disabled="paramsCheckboxVal.indexOf(1)===-1" />
          </el-form-item>
        </div>
        <div class="dialog-item">
          <el-checkbox class="dialog-checkbox" :label="2">{{ }}</el-checkbox>
          <el-form-item class="dialog-form-item" label="贴图纹理方向" prop="pic_file_texture_dir">
            <el-radio-group v-model="dialogFormVal.pic_file_texture_dir" :disabled="paramsCheckboxVal.indexOf(2)===-1">
              <el-radio :label="0">竖向</el-radio>
              <el-radio :label="1">横向</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </el-checkbox-group>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <div class="dialog-checkbox-control">
        <el-button type="primary" icon="el-icon-check" circle @click="paramsCheckboxVal=[0,1,2]" />
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
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
export default {
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
    }
  },
  data() {
    return {
      visible: false,
      key: 0,
      dialogFormVal: {}, // 修改的数据
      dialogFormValDefault: {
        door_color: '',
        folder: '',
        pic_file_texture_dir: 0
      },
      rules: {
        door_color: [{ trigger: 'change', message: '请输入颜色名' }],
        folder: [{ trigger: 'change', message: '请输入目录' }]
      },
      paramsCheckboxVal: [0, 1, 2]
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
      this.key++
    },
    initData() {
      this.paramsCheckboxVal = [0, 1, 2]
      if (this.materialCheckboxVal.length === 1) {
        const { door_color, folder, pic_file_texture_dir } = this.tableData[this.materialCheckboxVal[0]]
        this.dialogFormVal = { door_color, folder, pic_file_texture_dir }
      } else {
        let num = 0
        this.dialogFormVal = Object.assign({}, this.dialogFormValDefault)
        for (const key in this.dialogFormValDefault) {
          for (let index = 0; index < this.materialCheckboxVal.length - 1; index++) {
            if (this.tableData[this.materialCheckboxVal[index]][key] !== this.tableData[this.materialCheckboxVal[index + 1]][key]) {
              this.paramsCheckboxVal.splice(this.paramsCheckboxVal.indexOf(num), 1)
              this.dialogFormVal[key] = this.dialogFormValDefault[key]
              break
            } else {
              this.dialogFormVal[key] = this.tableData[this.materialCheckboxVal[index]][key]
            }
          }
          num++
        }
      }
      this.materialCheckboxVal.sort((a, b) => a - b)
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
              resObj[item] = this.dialogFormVal[item]
            }
          }
          const resArr = []
          for (const item of this.materialCheckboxVal) {
            const tempObj = JSON.parse(JSON.stringify(resObj))
            tempObj.id = this.tableData[item].id
            resArr.push(tempObj)
          }
          this.setVisible()
          this.$emit('returnDoorPicture', resArr)
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
.dialog-form-item .el-form-item__label{
  padding: 0;
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
.dialog-form{
  max-height: 50vh;
  overflow: auto;
}
.dialog-item{
  display: inline-block;
  width: 400px;
  margin-left: 25px;
}
.dialog-checkbox{
  float: left;
  line-height: 40px;
}
.dialog-form-item{
  margin-left: 25px;
}
.dialog-checkbox-control{
  float: left;
}
</style>
