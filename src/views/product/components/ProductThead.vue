<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <div style="float:left; width:88%">
        <el-divider content-position="left">基础信息</el-divider>
      </div>
      <div style="{float:right}">
        <el-button type="success" icon="el-icon-minus" circle @click="deleteProduct" />
        <el-button type="success" icon="el-icon-plus" circle @click="newProduct" />
      </div>
      <el-row :gutter="5">
        <el-col :span="6">
          <el-form-item label="目录1">
            <el-select v-model="form.dir1" placeholder="目录1" @change="changeDir1">
              <el-option v-for="item in dir1Options" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="目录2">
            <el-select v-model="form.dir2" placeholder="目录2" @change="changeDir2">
              <el-option v-for="item in dir2Options" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="目录3">
            <el-select v-model="form.dir3" placeholder="目录3" @change="changeDir3">
              <el-option v-for="item in dir3Options" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="目录4">
            <el-select v-model="form.dir4" placeholder="目录4">
              <el-option v-for="item in dir4Options" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="6">
          <el-form-item label="名称">
            <el-input v-model="form.name" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="型号">
            <el-input v-model="form.modelno" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="产品类型">
            <el-select v-model="form.product_type" placeholder="请选择产品类型">
              <el-option
                v-for="item in productTypeOpt"
                :key="item.key"
                :label="item.name"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="可修改尺寸">
            <el-select v-model="form.change_size" placeholder="可修改尺寸">
              <el-option
                v-for="item in enableChangeSize"
                :key="item.key"
                :label="item.name"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="6">
          <el-form-item label="开向">
            <el-select v-model="form.direction" placeholder="产品开向">
              <el-option
                v-for="item in productDirection"
                :key="item.key"
                :label="item.name"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所属品牌">
            <el-input v-model="form.brand" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="模型路径">
            <el-input v-model="form.model_path" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="预览图">
            <el-input v-model="form.pic" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider content-position="left">尺寸</el-divider>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="宽">
            <el-input v-model="form.l" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="深">
            <el-input v-model="form.w" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="高">
            <el-input v-model="form.h" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider content-position="left">参数化属性</el-divider>
      <el-row :gutter="5">
        <el-col :span="12">
          <el-form-item label="参数名">
            <el-input v-model="form.paramunit_name" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="参数类型">
            <el-select v-model="form.param_type" placeholder="请选择参数化类型">
              <el-option
                v-for="item in unitParamType"
                :key="item.key"
                :label="item.name"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider content-position="left">门板属性</el-divider>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="适用所有门板">
            <el-select v-model="form.all_doorstyle" placeholder="适用所有门板">
              <el-option
                v-for="item in allDoorStyle"
                :key="item.key"
                :label="item.name"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="门板反向限制">
            <el-select v-model="form.reverse_permit_door_mode">
              <el-option
                v-for="item in reversePermit"
                :key="item.key"
                :label="item.name"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="门板限制方案">
            <el-input v-model="form.door_style_scheme_id" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider content-position="left">线条属性</el-divider>
      <el-row :gutter="5">
        <el-col :span="12">
          <el-form-item label="台面眉线">
            <el-select v-model="form.worktop_mx_line" placeholder="允许台面/眉线">
              <el-option
                v-for="item in allowWtpMx"
                :key="item.key"
                :label="item.name"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="踢脚灯线">
            <el-select v-model="form.btm_light_line" placeholder="允许踢脚/灯线">
              <el-option
                v-for="item in allowbtmLight"
                :key="item.key"
                :label="item.name"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider content-position="left">定位</el-divider>
      <el-row :gutter="5">
        <el-col :span="12">
          <el-form-item label="定位方式">
            <el-select v-model="form.elva_mode" placeholder="定位方式">
              <el-option
                v-for="item in elvaMode"
                :key="item.key"
                :label="item.name"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="定位高度">
            <el-input v-model="form.elva" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider content-position="left">其他</el-divider>
      <el-row :gutter="2">
        <el-col :span="8">
          <el-form-item label="隐藏">
            <el-select v-model="form.hide" placeholder="是否显示">
              <el-option
                v-for="item in hidden"
                :key="item.key"
                :label="item.name"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="版本">
            <el-input v-model="form.version" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="参与报价">
            <el-select v-model="form.need_quotation" placeholder="参与报价" @change="quotationChange">
              <el-option
                v-for="item in quotation"
                :key="item.key"
                :label="item.name"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider v-if="showQuoData" content-position="center">报价数据</el-divider>
      <el-row :gutter="2">
        <el-col :span="8">
          <el-form-item v-show="showQuoData" label="编码">
            <el-input v-model="form.code" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item v-show="showQuoData" label="规格">
            <el-input v-model="form.standard" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item v-show="showQuoData" label="颜色">
            <el-input v-model="form.color" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="2">
        <el-col :span="8">
          <el-form-item v-show="showQuoData" label="材料">
            <el-input v-model="form.material" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item v-show="showQuoData" label="单位">
            <el-input v-model="form.unit" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item v-show="showQuoData" label="单价">
            <el-input v-model="form.price" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="2">
        <el-col :span="8">
          <el-form-item v-show="showQuoData" label="备注">
            <el-input v-model="form.comment" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item v-show="showQuoData" label="类型">
            <el-input v-model="form.class" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item v-show="showQuoData" label="扩展信息">
            <el-input v-model="form.ext1" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{ form.isNew?"提交":"保存" }}</el-button>
        <el-button @click="onCancel">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  ProdutTypeOption,
  UnitParamTypeOption,
  ProductDirectionOption,
  TrueFalseOption,
  ElvaModeOption
} from '@/utils/const'
import { getDirOptions, deleteProduct } from '@/api/product'
export default {
  props: {
    form: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      productTypeOpt: ProdutTypeOption,
      unitParamType: UnitParamTypeOption,
      productDirection: ProductDirectionOption,
      reversePermit: TrueFalseOption,
      allowWtpMx: TrueFalseOption,
      allowbtmLight: TrueFalseOption,
      elvaMode: ElvaModeOption,
      allDoorStyle: TrueFalseOption,
      enableChangeSize: TrueFalseOption,
      hidden: TrueFalseOption,
      quotation: TrueFalseOption,
      dirOptions: null,
      dir1Options: null,
      dir2Options: null,
      dir3Options: null,
      dir4Options: null,
      showQuoData: true
    }
  },
  computed: {
  },
  async created() {
    const { data } = await getDirOptions()
    this.dirOptions = data
    this.dir1Options = Object.keys(this.dirOptions)
    this.dir2Options = Object.keys(this.dirOptions[this.form.dir1])
    this.dir3Options = Object.keys(this.dirOptions[this.form.dir1][this.form.dir2])
    this.dir4Options = this.dirOptions[this.form.dir1][this.form.dir2][this.form.dir3]
  },
  methods: {
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    },
    quotationChange(value) {
      this.showQuoData = (value === 1)
    },
    changeDir1(value) {
      this.dir2Options = Object.keys(this.dirOptions[value])
      this.form.dir2 = this.dir2Options[0]
      this.dir3Options = Object.keys(this.dirOptions[value][this.form.dir2])
      this.form.dir3 = this.dir3Options[0]
      this.dir4Options = this.dirOptions[value][this.form.dir2][this.form.dir3]
      this.form.dir4 = this.dir4Options[0]
    },
    changeDir2(value) {
      this.dir3Options = Object.keys(this.dirOptions[this.form.dir1][value])
      this.form.dir3 = this.dir3Options[0]
      this.dir4Options = this.dirOptions[this.form.dir1][value][this.form.dir3]
      this.form.dir4 = this.dir4Options[0]
    },
    changeDir3(value) {
      this.dir4Options = this.dirOptions[this.form.dir1][this.form.dir2][value]
      this.form.dir4 = this.dir4Options[0]
    },
    deleteProduct() {
      this.$confirm('此操作将删除该產品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProduct(this.form.modelno)
        this.$notify.deleteOk()
        this.$emit('delete', this.form.modelno)
        this.newProduct()
      })
    },
    newProduct() {
      this.form.isNew = true
      this.form.name = '新產品'
      this.form.modelno = '新產品'
      this.form.dir1 = this.dir1Options[0]
      this.form.dir2 = this.dir2Options[0]
      this.form.dir3 = this.dir3Options[0]
      this.form.dir4 = this.dir4Options[0]
    }
  }
}
</script>

<style scoped>
.line {
  text-align: center;
}
.el-divider--horizontal {
  margin: 20px 0;
  padding-bottom: 20px;
  background: 0 0;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 12;
  border-top: 2px solid #b6b4b4ec;
}
</style>

