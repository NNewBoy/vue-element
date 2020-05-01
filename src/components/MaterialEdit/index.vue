<template>
  <div>
    <BrandsCheckbox @selectBrands="selectBrands" />
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

      <div class="menu-item radio-menu">
        <el-radio v-model="radioVal" class="radio-menu-item" border size="small" label="material">
          编辑材质
        </el-radio>
        <el-radio v-model="radioVal" class="radio-menu-item" border size="small" label="catalog">
          移动目录
        </el-radio>
        <el-radio v-model="radioVal" class="radio-menu-item" border size="small" label="picture">
          贴图属性
        </el-radio>
      </div>

      <div class="menu-item">
        <el-checkbox-group
          v-model="brandboxVal"
          class="brand-box"
          size="small"
        >
          <el-checkbox border label="brand">
            编辑品牌参数
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
        max-height="500px"
        :data="tableDataFilter"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >

        <slot />

        <el-table-column align="center" label="尚品" width="100">
          <template slot-scope="{row}">
            <span v-if="!brandboxVal">{{ row.spzp }}</span>
            <span v-else class="my-checkbox" :class="row.spzp===1?'is-checked':''" @click="row.spzp=row.spzp===1?0:1">
              <span class="my-checkbox-inner" />
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="维意" width="100">
          <template slot-scope="{row}">
            <span v-if="!brandboxVal">{{ row.wayes }}</span>
            <span v-else class="my-checkbox" :class="row.wayes===1?'is-checked':''" @click="row.wayes=row.wayes===1?0:1">
              <span class="my-checkbox-inner" />
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="孖酷" width="100">
          <template slot-scope="{row}">
            <span v-if="!brandboxVal">{{ row.homkoo }}</span>
            <span v-else class="my-checkbox" :class="row.homkoo===1?'is-checked':''" @click="row.homkoo=row.homkoo===1?0:1">
              <span class="my-checkbox-inner" />
            </span>
          </template>
        </el-table-column>

        <!-- <el-table-column align="center" label="" min-width="1" />避免材质参数前移 -->
        <slot name="last_column" /><!-- 自动推后 -->

        <div v-if="radioVal==='material'">
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
        </div>

        <div v-if="radioVal==='picture' && searchTarget==='door_color'">
          <el-table-column align="center" label="目录" width="200">
            <template slot-scope="{row}">
              {{ row.folder }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="贴图纹理方向" width="120">
            <template slot-scope="{row}">
              <span v-if="row.pic_file_texture_dir===1">横向</span>
              <span v-else-if="row.pic_file_texture_dir===0">竖向</span>
              <span v-else>
                {{ row.pic_file_texture_dir }}
              </span>
            </template>
          </el-table-column>
        </div>

        <div v-if="radioVal==='picture' && searchTarget==='name'">
          <el-table-column align="center" label="云渲染材质名" width="200">
            <template slot-scope="{row}">
              {{ row.mat_type_name }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="云渲染材质id" width="200">
            <template slot-scope="{row}">
              {{ row.mat_type_id }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="贴图纹理方向" width="120">
            <template slot-scope="{row}">
              <span v-if="row.pic_file_texture_dir===1">横向</span>
              <span v-else-if="row.pic_file_texture_dir===0">竖向</span>
              <span v-else>
                {{ row.pic_file_texture_dir }}
              </span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="是否可以喷绘" width="120">
            <template slot-scope="{row}">
              <span v-if="row.permit_paint===1">是</span>
              <span v-else-if="row.permit_paint===0">否</span>
              <span v-else>
                {{ row.permit_paint }}
              </span>
            </template>
          </el-table-column>
        </div>

        <div v-if="radioVal!==''">
          <el-table-column align="center" label="编辑材质" min-width="150">
            <template slot="header">
              <div class="header-a-border">
                <span class="my-checkbox" @click="selectAll">
                  <span class="my-checkbox-inner select-all" />
                </span>
                <span>编辑材质</span>
              </div>
            </template>
            <template slot-scope="scope">
              <el-checkbox :label="scope.$index">{{ }}</el-checkbox>
              <el-button
                v-if="materialCheckboxVal.indexOf(scope.$index)>=0"
                type="primary"
                size="small"
                icon="el-icon-edit"
                @click="selectMaterial(scope)"
              >选择</el-button>
            </template>
          </el-table-column>
        </div>
      </el-table>
    </el-checkbox-group>

    <el-dialog v-el-drag-dialog title="修改材质参数" top="10vh" :visible.sync="dialogFormVisible">
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
            <i class="el-icon-check" />{{ tableDataFilter[item][searchTarget] }}
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

    <CatalogDialog
      :catalog-dialog-visible="catalogDialogVisible"
      :material-checkbox-val="materialCheckboxVal"
      :table-data="tableDataFilter"
      :from-catalog="fromCatalog"
      :cascader-datas="cascaderDatas"
      :search-target="searchTarget"
      @closeCatalogDialog="closeDialog('catalog')"
      v-on="$listeners"
    />
    <DoorPictureDialog
      :dialog-visible="doorPictureDialogVisible"
      :material-checkbox-val="materialCheckboxVal"
      :table-data="tableDataFilter"
      @closeDialog="closeDialog('door')"
      v-on="$listeners"
    />
    <MaterialPictureDialog
      :dialog-visible="materialPictureDialogVisible"
      :material-checkbox-val="materialCheckboxVal"
      :table-data="tableDataFilter"
      @closeDialog="closeDialog('material')"
      v-on="$listeners"
    />
  </div>
</template>

<script type="text/javascript">
/**
 * @property {Array} datas el-table的数据
 * @property {Array} cascaderDatas el-cascader的数据,转移目录
 * @property {Array} nowCatalog 当前选择的目录数组
 * @property {Boolean} ListLoading 表格数据更新时所使用的等待请求完成的参数
 * @property {String} searchTarget 搜索时对应的匹配字段
 * @function getParams 返回与datas同类型的数组，对象包括id和修改的参数
 * @function changeCatalog 返回与目录转移数据{id,from,to}，id为选择的材质id数组，from为当前目录数组，to为目标目录数组
 */
import toPinyin from '@/utils/chineseToPinyin'
import BrandsCheckbox from './components/BrandsCheckbox'
import CatalogDialog from './components/CatalogDialog'
import DoorPictureDialog from './components/DoorPictureDialog'
import MaterialPictureDialog from './components/MaterialPictureDialog'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
export default {
  name: 'MaterialEdit',
  components: { BrandsCheckbox, CatalogDialog, DoorPictureDialog, MaterialPictureDialog },
  directives: { elDragDialog },
  props: {
    datas: {
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
    fromCatalog: {
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
    },
    searchTarget: {
      require: true,
      type: String,
      default: 'name'
    }
  },
  data() {
    // const validateFun = (rule, value, callback) => {
    //   const reg = /^-?\d+\.?\d*$/
    //   if (reg.test(value)) {
    //     callback()
    //   } else {
    //     callback(new Error('请输入数字'))
    //   }
    // }
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
      searchText: '',
      radioVal: '', // 选择材料参数
      brandboxVal: false, // 修改品牌参数
      materialCheckboxVal: [], // 选择索引
      brandCheckboxVal: [], // 品牌选择
      paramsCheckboxVal: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], // 需修改参数
      dialogFormVisible: false,
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
      lastBrand: { check: this.$store.getters.brands, all: true }, // 上一个品牌选项，用于重置
      tableData: [],
      updateParams: false, // 确定是否重新渲染表格
      catalogDialogVisible: false,
      doorPictureDialogVisible: false,
      materialPictureDialogVisible: false
    }
  },
  computed: {
    tableDataFilter: function() {
      return this.tableData.filter(el => {
        const txt = el[this.searchTarget]
        const st = this.searchText.toUpperCase()
        return txt.toUpperCase().indexOf(st) >= 0 ||
          toPinyin.getFirstLetter(txt).indexOf(st) >= 0 ||
          toPinyin.chineseToPinYin(txt).toUpperCase().indexOf(st) >= 0
      })
    }
  },
  watch: {
    datas: {
      immediate: true,
      deep: true,
      handler(val) { // 初始化
        if (this.updateParams === false) {
          this.searchText = ''
          this.radioVal = ''
          this.brandboxVal = false
          this.materialCheckboxVal = []
          this.paramsCheckboxVal = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
          this.dialogFormVisible = false
          this.selectAllVal = false
          this.tableData = []
        }
        this.selectBrands(this.lastBrand)
      }
    },
    radioVal(val) {
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
      } else {
        // this.key++
      }
    }
  },
  methods: {
    closeDialog(target) {
      this.updateParams = true
      if (target === 'catalog') {
        this.catalogDialogVisible = false
      } else if (target === 'door') {
        this.doorPictureDialogVisible = false
      } else if (target === 'material') {
        this.materialPictureDialogVisible = false
      }
      this.selectAllVal = false
      this.materialCheckboxVal = []
    },
    saveBrand() {
      const resArr = []
      for (const item of this.tableDataFilter) {
        const { id, spzp, wayes, homkoo } = item
        resArr.push({ id, spzp, wayes, homkoo })
      }
      this.$emit('getParams', resArr)
    },
    resetBrand() {
      this.selectBrands(this.lastBrand)
    },
    selectBrands(res) {
      this.lastBrand = res
      /* 初始化 */
      if (this.updateParams === false) {
        this.searchText = ''
        this.radioVal = ''
        this.brandboxVal = false
        this.materialCheckboxVal = []
        this.paramsCheckboxVal = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        this.dialogFormVisible = false
        this.selectAllVal = false
        this.tableData = []
      }

      if (res.all) {
        this.tableData = JSON.parse(JSON.stringify(this.datas))
      } else if (res.check.length > 0) {
        const temp = []
        for (const item of this.datas) {
          for (const i of res.check) {
            if (item.spzp === 1 && i === 'spzp') {
              temp.push(item)
              break
            }
            if (item.wayes === 1 && i === 'wayes') {
              temp.push(item)
              break
            }
            if (item.homkoo === 1 && i === 'homkoo') {
              temp.push(item)
              break
            }
          }
        }
        this.tableData = JSON.parse(JSON.stringify(temp))
      } else if (res.check.length === 0) {
        this.tableData = []
      }
      if (this.updateParams === false) {
        this.key++
      }
      this.updateParams = false
    },
    selectAll() {
      this.selectAllVal = !this.selectAllVal
      const length = this.tableDataFilter.length
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
    clickCancel() {
      this.dialogFormVisible = false
      this.selectAllVal = false
      this.materialCheckboxVal = []
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
              if (resObj[item]) { resObj[item] = Number(resObj[item]) }
            }
          }
          const resArr = []
          for (const item of this.materialCheckboxVal) {
            const tempObj = JSON.parse(JSON.stringify(resObj))
            tempObj.id = this.tableDataFilter[item].id
            resArr.push(tempObj)
          }
          this.updateParams = true
          this.selectAllVal = false
          this.materialCheckboxVal = []
          this.$emit('getParams', resArr)
        }
      })
    },
    deleteMaterialItem(index) {
      this.materialCheckboxVal.splice(index, 1)
    },
    selectMaterial(scope) {
      if (this.radioVal === 'material') {
        if (this.materialCheckboxVal.indexOf(scope.$index) !== -1) {
          this.paramsCheckboxVal = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
          if (this.materialCheckboxVal.length === 1) {
            const { u, v, alfa_val, reflect_val, diffuse_val, color_blend_factor, roughness, gloss_val, gloss_size_val, bump_val, diffuse_alpha_val } = scope.row
            this.dialogFormVal = { u, v, alfa_val, reflect_val, diffuse_val, color_blend_factor, roughness, gloss_val, gloss_size_val, bump_val, diffuse_alpha_val }
          } else {
            let num = 0
            this.dialogFormVal = Object.assign({}, this.dialogFormValDefault)
            for (const key in this.dialogFormValDefault) {
              for (let index = 0; index < this.materialCheckboxVal.length - 1; index++) {
                if (this.tableDataFilter[this.materialCheckboxVal[index]][key] !== this.tableDataFilter[this.materialCheckboxVal[index + 1]][key]) {
                  if (key === 'u' || key === 'v') {
                    this.paramsCheckboxVal.splice(0, 1)
                  } else {
                    this.paramsCheckboxVal.splice(this.paramsCheckboxVal.indexOf(num - 1), 1)
                  }
                  this.dialogFormVal[key] = this.dialogFormValDefault[key]
                  break
                } else {
                  this.dialogFormVal[key] = this.tableDataFilter[this.materialCheckboxVal[index]][key]
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
      } else if (this.radioVal === 'catalog') {
        this.materialCheckboxVal.sort((a, b) => a - b)
        this.catalogDialogVisible = true
      } else if (this.radioVal === 'picture') {
        this.materialCheckboxVal.sort((a, b) => a - b)
        if (this.searchTarget === 'door_color') {
          this.doorPictureDialogVisible = true
        } else if (this.searchTarget === 'name') {
          this.materialPictureDialogVisible = true
        }
      }
    }
  }
}
</script>
<style>
.menu-list .menu-item.radio-menu{
  margin-right: 0;
}
.radio-menu .radio-menu-item{
  margin-right: 20px;
}
.radio-menu .el-radio.radio-menu-item.is-bordered{
  margin-left: 0;
}
.dialog-form-item .el-form-item__label{
  padding: 0;
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
