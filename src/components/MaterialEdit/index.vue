<template>
  <div>
    <typeFilter :data="brandList" filter-name="品牌" :multi-choice="true" @getType="getType" />
    <br>
    <div class="menu-list">
      <div class="menu-item">
        <el-input
          v-model="searchText"
          clearable
          size="small"
          placeholder="查找"
          prefix-icon="el-icon-search"
        />
      </div>

      <div class="menu-item">
        <el-checkbox-group
          v-model="checkboxVal"
          class="material-box"
          size="small"
        >
          <el-checkbox border label="material">
            材质参数
          </el-checkbox>
        </el-checkbox-group>
      </div>

      <div class="menu-item">
        <el-checkbox-group
          v-model="brandboxVal"
          class="brand-box"
          size="small"
        >
          <el-checkbox border label="brand">
            修改品牌参数
          </el-checkbox>
        </el-checkbox-group>
        <el-button-group v-if="brandboxVal" class="brand-button">
          <el-button type="success" size="small" @click="saveBrand">保存</el-button>
          <el-button type="warning" size="small" @click="resetBrand">重置</el-button>
        </el-button-group>
      </div>

    </div>
    <br>
    <el-checkbox-group
      v-model="materialCheckboxVal"
    >
      <el-table
        :key="key"
        v-loading="listLoading"
        :data="tableData.filter(el=>{return el.name.toLowerCase().indexOf(searchText.toLowerCase())>=0})"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <slot />
        <el-table-column align="center" label="尚品" width="100">
          <template slot-scope="{row}">
            {{ row.spzp }}
            <el-button v-if="brandboxVal" size="mini" type="primary" class="el-icon-d-caret" circle @click="row.spzp=row.spzp===1?0:1" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="维意" width="100">
          <template slot-scope="{row}">
            {{ row.wayes }}
            <el-button v-if="brandboxVal" size="mini" type="primary" class="el-icon-d-caret" circle @click="row.wayes=row.wayes===1?0:1" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="孖酷" width="100">
          <template slot-scope="{row}">
            {{ row.homkoo }}
            <el-button v-if="brandboxVal" size="mini" type="primary" class="el-icon-d-caret" circle @click="row.homkoo=row.homkoo===1?0:1" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="" min-width="1" /><!-- 避免材质参数前移 -->
        <div v-if="checkboxVal">
          <el-table-column align="center" label="贴图长" width="100">
            <template slot-scope="{row}">
              {{ row.u }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="贴图宽" width="100">
            <template slot-scope="{row}">
              {{ row.v }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="透明度" width="100">
            <template slot-scope="{row}">
              {{ row.alfa_val }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="反射度" width="100">
            <template slot-scope="{row}">
              {{ row.reflect_val }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="贴图亮度" width="100">
            <template slot-scope="{row}">
              {{ row.diffuse_val }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="渗透度" width="100">
            <template slot-scope="{row}">
              {{ row.color_blend_factor }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="粗糙度" width="100">
            <template slot-scope="{row}">
              {{ row.roughness }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="高光亮度" width="100">
            <template slot-scope="{row}">
              {{ row.gloss_val }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="高光范围" width="100">
            <template slot-scope="{row}">
              {{ row.gloss_size_val }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="凹凸程度" width="100">
            <template slot-scope="{row}">
              {{ row.bump_val }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="透光度" width="100">
            <template slot-scope="{row}">
              {{ row.diffuse_alpha_val }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="材质参数编辑" min-width="200">
            <template slot="header">
              <div class="header-a-border">
                <a href="javascript:" class="select-all el-icon-check" @click="selectAll" />
                <span>材质参数编辑</span>
              </div>
            </template>
            <template slot-scope="scope">
              <div v-if="showEdit">
                <el-checkbox :label="scope.$index">{{ }}</el-checkbox>
                <el-button
                  :type="materialCheckboxVal.indexOf(scope.$index)!==-1?'primary':'info'"
                  size="small"
                  icon="el-icon-circle-check-outline"
                  @click="selectMaterial(scope)"
                >选择</el-button>
                <el-button
                  type="warning"
                  size="small"
                  icon="el-icon-circle-check-outline"
                  @click="cancelSelect(scope)"
                >取消</el-button>
              </div>
              <el-button
                v-else
                type="primary"
                size="small"
                icon="el-icon-edit"
                @click="editMaterial(scope)"
              >
                修改
              </el-button>
            </template>
          </el-table-column>
        </div>
      </el-table>
    </el-checkbox-group>

    <el-dialog title="修改材质参数" :visible.sync="dialogFormVisible">
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
            <i class="el-icon-check" />{{ item+1 }}
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
          <el-button type="danger" icon="el-icon-delete" circle @click="paramsCheckboxVal=[]" />
        </div>
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateData">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import typeFilter from '@/components/TypeFilter'
export default {
  name: 'MaterialEdit',
  components: { typeFilter },
  props: {
    datas: {
      require: true,
      type: Array,
      default() {
        return []
      }
    },
    listLoading: {
      require: true,
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateFun = (rule, value, callback) => {
      const reg = /^-?\d+\.?\d*$/
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error('请输入数字'))
      }
    }
    return {
      searchText: '',
      checkboxVal: false, // 选择材料参数
      brandboxVal: false, // 修改品牌参数
      materialCheckboxVal: [], // 选择索引
      paramsCheckboxVal: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], // 需修改参数
      showEdit: false, // 显示编辑按钮
      dialogFormVisible: false,
      rules: {
        u: [{ trigger: 'change', validator: validateFun }],
        v: [{ trigger: 'change', validator: validateFun }],
        alfa_val: [{ trigger: 'change', validator: validateFun }],
        reflect_val: [{ trigger: 'change', validator: validateFun }],
        diffuse_val: [{ trigger: 'change', validator: validateFun }],
        color_blend_factor: [{ trigger: 'change', validator: validateFun }],
        roughness: [{ trigger: 'change', validator: validateFun }],
        gloss_val: [{ trigger: 'change', validator: validateFun }],
        gloss_size_val: [{ trigger: 'change', validator: validateFun }],
        bump_val: [{ trigger: 'change', validator: validateFun }],
        diffuse_alpha_val: [{ trigger: 'change', validator: validateFun }]
      },
      dialogFormVal: {},
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
      key: 1, // table key
      selectAllVal: false,
      brandList: ['尚品', '维意', '孖酷'],
      tableData: [],
      updateParams: false // 确定是否重新渲染表格
    }
  },
  computed: {},
  watch: {
    datas: {
      immediate: true,
      deep: true,
      handler(val) { // 初始化
        if (this.updateParams === false) {
          this.searchText = ''
          this.checkboxVal = false
          this.brandboxVal = false
          this.materialCheckboxVal = []
          this.paramsCheckboxVal = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
          this.showEdit = false
          this.dialogFormVisible = false
          this.selectAllVal = false
          this.tableData = []
        }
        this.brandList = ['尚品', '维意', '孖酷']
      }
    },
    checkboxVal(valArr) {
      this.key = this.key + 1// 为了保证table 每次都会重渲 In order to ensure the table will be re-rendered each time
    },
    materialCheckboxVal(val) {
      if (val.length === 0) {
        this.dialogFormVisible = false
      }
    },
    brandboxVal(val) {
      if (val === false) {
        this.resetBrand()
      }
    }
  },
  methods: {
    saveBrand() {
      const resArr = []
      for (const item of this.tableData) {
        const { id, spzp, wayes, homkoo } = item
        resArr.push({ id, spzp, wayes, homkoo })
      }
      this.$emit('getParams', resArr)
    },
    resetBrand() {
      this.brandList = ['尚品', '维意', '孖酷']
    },
    getType(arr) {
      /* 初始化 */
      if (this.updateParams === false) {
        this.searchText = ''
        this.checkboxVal = false
        this.brandboxVal = false
        this.materialCheckboxVal = []
        this.paramsCheckboxVal = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        this.showEdit = false
        this.dialogFormVisible = false
        this.selectAllVal = false
        this.tableData = []
      }

      if (arr.length === 3) {
        this.tableData = JSON.parse(JSON.stringify(this.datas))
      } else if (arr.length > 0) {
        const temp = []
        for (const item of this.datas) {
          for (const i of arr) {
            if (item.spzp === 1 && i.index === 0) {
              temp.push(item)
              break
            }
            if (item.wayes === 1 && i.index === 1) {
              temp.push(item)
              break
            }
            if (item.homkoo === 1 && i.index === 2) {
              temp.push(item)
              break
            }
          }
        }
        this.tableData = JSON.parse(JSON.stringify(temp))
      } else if (arr.length === 0) {
        this.tableData = []
      }
      if (this.updateParams === false) {
        this.key++
      }
      this.updateParams = false
    },
    selectAll() {
      this.selectAllVal = !this.selectAllVal
      this.showEdit = true
      const length = this.tableData.length
      if (this.selectAllVal) {
        for (let i = 0; i < length; i++) {
          if (this.materialCheckboxVal.indexOf(i) === -1) {
            this.materialCheckboxVal.push(i)
          }
        }
      } else {
        this.materialCheckboxVal = []
      }
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
          // const { u, v, alfa_val, reflect_val, diffuse_val, color_blend_factor, roughness, gloss_val, gloss_size_val, bump_val, diffuse_alpha_val } = this.dialogFormVal
          if (this.paramsCheckboxVal.length === 0) {
            return
          }
          const resObj = {}
          const order = Object.keys(this.dialogFormVal)
          for (const item in this.dialogFormVal) {
            if (item === 'u' || item === 'v') {
              if (this.paramsCheckboxVal.indexOf(0) !== -1) {
                resObj[item] = this.dialogFormVal[item]
              }
            } else if (this.paramsCheckboxVal.indexOf(order.indexOf(item) - 1) !== -1) {
              resObj[item] = this.dialogFormVal[item]
            }
          }
          for (const item in resObj) {
            if (item !== 'u' && item !== 'v') {
              resObj[item] = Number(resObj[item])
            }
          }
          const resArr = []
          for (const item of this.materialCheckboxVal) {
            const tempObj = JSON.parse(JSON.stringify(resObj))
            tempObj.id = this.tableData[item].id
            resArr.push(tempObj)
          }
          this.updateParams = true
          this.$emit('getParams', resArr)
        }
      })
    },
    deleteMaterialItem(index) {
      this.materialCheckboxVal.splice(index, 1)
    },
    selectMaterial(scope) {
      if (this.materialCheckboxVal.indexOf(scope.$index) !== -1) {
        this.selectAllVal = false
        this.showEdit = false
        this.paramsCheckboxVal = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        if (this.materialCheckboxVal.length === 1) {
          const { u, v, alfa_val, reflect_val, diffuse_val, color_blend_factor, roughness, gloss_val, gloss_size_val, bump_val, diffuse_alpha_val } = scope.row
          this.dialogFormVal = { u, v, alfa_val, reflect_val, diffuse_val, color_blend_factor, roughness, gloss_val, gloss_size_val, bump_val, diffuse_alpha_val }
        } else {
          let num = 0
          this.dialogFormVal = Object.assign({}, this.dialogFormValDefault)
          for (const key in this.dialogFormValDefault) {
            for (let index = 0; index < this.materialCheckboxVal.length - 1; index++) {
              if (this.tableData[this.materialCheckboxVal[index]][key] !== this.tableData[this.materialCheckboxVal[index + 1]][key]) {
                if (key === 'u' || key === 'v') {
                  this.paramsCheckboxVal.splice(0, 1)
                } else {
                  this.paramsCheckboxVal.splice(this.paramsCheckboxVal.indexOf(num), 1)
                }
                break
              }
            }
            num++
          }
        }
        this.materialCheckboxVal.sort((a, b) => a - b)
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].$el.scrollTop = 0
          this.$refs['dataForm'].clearValidate()
        })
      }
    },
    cancelSelect(scope) {
      this.showEdit = false
      this.selectAllVal = false
      const index = this.materialCheckboxVal.indexOf(scope.$index)
      if (index !== -1) {
        this.materialCheckboxVal = []
      }
    },
    editMaterial(scope) {
      this.materialCheckboxVal = []
      this.showEdit = true
      if (this.materialCheckboxVal.indexOf(scope.$index) === -1) {
        this.materialCheckboxVal.push(scope.$index)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-list{
  display: flex;
  align-items: center;
}
.menu-item{
  display: inline-block;
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
.select-all{
  height: 20px;
  line-height: 20px;
  font-size: 20px;
  margin-right: 20px;
  background-color: rgb(160, 207, 255);
  color: white;
  border: 1px solid rgb(160, 207, 255);
  border-radius: 2px;

  &:hover{
    border: 1px solid #46a6ff;
    background-color: #46a6ff;
  }

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
    width: 221px;
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
</style>
