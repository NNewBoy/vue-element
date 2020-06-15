<template>
  <div class="app-container">
    <Collapse :init-show="true" @onShow="onResize">
      <template slot="title">
        筛选
        <i class="header-icon el-icon-info" />
      </template>
      <LazyFilter filter-name="产品目录" :load="loadFun" :level="4" @getResult="getResult" />
      <el-row>
        <el-col :span="10">
          <StatusFilter @selectStatus="selectStatus" />
        </el-col>
        <el-col :span="10">
          <BrandsFilter @selectBrands="selectBrands" />
        </el-col>
      </el-row>
    </Collapse>
    <br>
    <div class="menu-list">
      <div class="menu-item">
        <el-input
          v-model="listQuery.search"
          clearable
          size="mini"
          placeholder="查找"
          prefix-icon="el-icon-search"
        />
        <el-button type="primary" icon="el-icon-search" size="mini" @click="onSearch" />
      </div>

      <div class="menu-item">
        <el-dropdown
          size="mini"
          split-button
          type="primary"
          @click="selectMaterial"
          @command="command=>radioVal=command"
        >
          {{ radioVal | dropFilter }}
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="basic">基础信息</el-dropdown-item>
            <el-dropdown-item command="catalog">目录</el-dropdown-item>
            <el-dropdown-item command="size">尺寸</el-dropdown-item>
            <el-dropdown-item command="door">门板属性</el-dropdown-item>
            <el-dropdown-item command="line">线条属性</el-dropdown-item>
            <el-dropdown-item command="position">定位</el-dropdown-item>
            <el-dropdown-item command="quote">报价数据</el-dropdown-item>
            <el-dropdown-item command="other">其他</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <div class="menu-item radio-menu">
        <el-button-group class="brand-button">
          <el-button type="success" size="mini" @click="saveProperty">保存</el-button>
          <el-button type="warning" size="mini" @click="resetProperty">重置</el-button>
          <el-button type="danger" size="mini" @click="onDelete">删除</el-button>
          <el-button type="primary" size="mini" @click="addProperty">添加</el-button>
          <el-button type="primary" size="mini" @click="copyProperty">复制</el-button>
          <el-button type="primary" size="mini" @click="pasteProperty">粘贴</el-button>
        </el-button-group>
      </div>
    </div>
    <br>
    <vxe-table
      ref="tbTable"
      keep-source
      edit-config
      :height="tableHeight+'px'"
      :loading="loadingList"
      :data="dataList"
      :mouse-config="{selected: true}"
      :keyboard-config="{isArrow: true, isDel: true, isEnter: true, isTab: true, isEdit: true, editMethod}"
      @checkbox-change="handleSelectionChange"
      @checkbox-all="handleSelectionChange"
    >
      <vxe-table-column type="checkbox" width="45" />
      <vxe-table-column type="seq" title="ID" width="50" />
      <vxe-table-column field="name" title="名称" min-width="200" :edit-render="{name: '$input'}" />
      <vxe-table-column field="modelno" title="型号" min-width="200" :edit-render="{name: '$input'}" />

      <!-- 基础信息 -->
      <vxe-table-column field="product_type" title="产品类型" width="150" :edit-render="{name: 'myButton', events: {click: onSelected},props: produtTypeOption}" />
      <vxe-table-column field="change_size" title="可修改尺寸" width="110" :edit-render="{name: 'trueFalseEditSwitch'}" />
      <vxe-table-column field="direction" title="开向" width="100" :edit-render="{name: '$select', options: productDirectionOption, optionProps: {value: 'key', label: 'name'}}" />
      <vxe-table-column field="brand" title="所属品牌" width="100" :edit-render="{name: '$input'}" />
      <vxe-table-column field="model_path" title="模型路径" width="100" :edit-render="{name: '$input'}" />
      <vxe-table-column field="pic" title="预览图" width="200" :edit-render="{name: '$input'}" />
      <!-- 目录 -->
      <vxe-table-column field="dir1" title="目录1" width="100" :edit-render="{name: 'showStatus'}" />
      <vxe-table-column field="dir2" title="目录2" width="100" :edit-render="{name: 'showStatus'}" />
      <vxe-table-column field="dir3" title="目录3" width="100" :edit-render="{name: 'showStatus'}" />
      <vxe-table-column field="dir4" title="目录4" width="100" :edit-render="{name: 'showStatus'}" />
      <!-- 尺寸 -->
      <vxe-table-column field="paramunit_name" title="参数名" width="200" :edit-render="{name: '$input'}" />
      <vxe-table-column field="param_type" title="参数类型" width="150" :edit-render="{name: '$select', options: unitParamTypeOption, optionProps: {value: 'key', label: 'name'}}" />
      <vxe-table-column field="l" title="宽" width="100" :edit-render="{name: '$input', props: {type:'number',min:0}}" />
      <vxe-table-column field="w" title="深" width="100" :edit-render="{name: '$input', props: {type:'number',min:0}}" />
      <vxe-table-column field="h" title="高" width="100" :edit-render="{name: '$input', props: {type:'number',min:0}}" />
      <!-- 门板属性 -->
      <vxe-table-column field="all_doorstyle" title="适用所有门板" width="130" :edit-render="{name: 'trueFalseEditSwitch'}" />
      <vxe-table-column field="reverse_permit_door_mode" title="门板反向限制" width="130" :edit-render="{name: 'trueFalseEditSwitch'}" />
      <vxe-table-column field="door_style_scheme_id" title="门板限制方案" width="130" :edit-render="{name: '$input', props: {type:'integer'}}" />
      <!-- 线条属性 -->
      <vxe-table-column field="worktop_mx_line" title="台面眉线" width="100" :edit-render="{name: 'trueFalseEditSwitch'}" />
      <vxe-table-column field="btm_light_line" title="踢脚灯线" width="100" :edit-render="{name: 'trueFalseEditSwitch'}" />
      <!-- 定位 -->
      <vxe-table-column field="elva_mode" title="定位方式" width="200" :edit-render="{name: 'myButton', events: {click: onSelected}, props: elvaModeOption}" />
      <vxe-table-column field="elva" title="定位高度" width="100" :edit-render="{name: '$input', props: {type:'number',min:0}}" />
      <!-- 报价数据 -->
      <vxe-table-column field="need_quotation" title="参与报价" width="100" :edit-render="{name: 'trueFalseEditSwitch'}" />
      <vxe-table-column field="code" title="编码" width="120" :edit-render="{name: '$input'}" />
      <vxe-table-column field="standard" title="规格" width="150" :edit-render="{name: '$input'}" />
      <vxe-table-column field="color" title="颜色" width="100" :edit-render="{name: '$input'}" />
      <vxe-table-column field="material" title="材料" width="100" :edit-render="{name: '$input'}" />
      <vxe-table-column field="unit" title="单位" width="80" :edit-render="{name: '$input'}" />
      <vxe-table-column field="price" title="单价" width="100" :edit-render="{name: '$input', props: {type:'number',min:0}}" />
      <vxe-table-column field="comment" title="备注" width="150" :edit-render="{name: '$input'}" />
      <vxe-table-column field="class" title="类型" width="100" :edit-render="{name: '$input'}" />
      <vxe-table-column field="ext1" title="扩展信息" width="100" :edit-render="{name: '$input'}" />
      <!-- 其他 -->
      <vxe-table-column field="hide" title="隐藏" width="100" :edit-render="{name: 'trueFalseEditSwitch'}" />
      <vxe-table-column field="version" title="版本" width="120" :edit-render="{name: '$input'}" />

    </vxe-table>

    <vxe-pager
      :loading="loadingList"
      :current-page="listQuery.page"
      :page-size="listQuery.per_page"
      :total="total"
      @page-change="fetchData"
    />

    <SelectDialog
      title="请选择"
      :dialog-visible="dialogSelected.visible"
      :table-data="dialogSelected.selection"
      :selected="dialogSelected.selected"
      @closeSelectDialog="closeDialog('dialogSelect')"
      @getSelected="changeParams"
    />
    <CatalogLazyDialog
      :catalog-dialog-visible="catalogLazyDialogVisible"
      :selected-form-val="selection"
      :from-catalog="selectedItem"
      search-target="name"
      @closeCatalogDialog="closeDialog('catalog')"
    />
    <VxeCommonDialog
      :title="commonDialogTitle"
      :label-width="commonLabelWidth"
      :dialog-visible="dialogVisible"
      :selected-form-val="selection"
      :dialog-form-val-default="commonDialogDefault"
      :rules="commonDialogRules"
      search-target="name"
      @closeDialog="closeDialog('dialog')"
    />

  </div>
</template>

<script type="text/javascript">
import elTableInfiniteScroll from 'el-table-infinite-scroll'
import { getProductDir, getProductList, updateProduct, deleteProduct } from '@/api/product'
import LazyFilter from '@/components/LazyFilter'
import BrandsFilter from '@/components/MaterialEdit/filter/BrandsFilter'
import StatusFilter from '@/components/MaterialEdit/filter/StatusFilter'
import Collapse from '@/components/Collapse'
import CatalogLazyDialog from '@/components/MaterialEdit/dialog/VxeCatalogLazyDialog'
import SelectDialog from '@/components/MaterialEdit/dialog/VxeSelectDialog'
import VxeCommonDialog from '@/components/MaterialEdit/dialog/VxeCommonDialog'
import { copyToClipboard, pasteFromClipboard } from '@/utils/clipboard'
import {
  ProdutTypeOption,
  UnitParamTypeOption,
  ProductDirectionOption,
  TrueFalseOption,
  ElvaModeOption
} from '@/utils/const'

export default {
  directives: {
    'el-table-infinite-scroll': elTableInfiniteScroll
  },
  components: { LazyFilter, BrandsFilter, StatusFilter, Collapse, CatalogLazyDialog, SelectDialog, VxeCommonDialog },
  filters: {
    dropFilter: function(val) {
      switch (val) {
        case 'basic':
          return '基础信息'
        case 'catalog':
          return '目录'
        case 'size':
          return '尺寸'
        case 'door':
          return '门板属性'
        case 'line':
          return '线条属性'
        case 'position':
          return '定位'
        case 'quote':
          return '报价数据'
        case 'other':
          return '其他'
        default:
          return '更多属性'
      }
    }
  },
  data() {
    return {
      columns: [], // 表格所展示列
      dialogSelected: {
        row: {},
        column: {},
        selection: [],
        selected: '',
        visible: false
      }, // 当前选中项
      produtTypeOption: ProdutTypeOption,
      unitParamTypeOption: UnitParamTypeOption,
      productDirectionOption: ProductDirectionOption,
      trueFalseOption: TrueFalseOption,
      elvaModeOption: ElvaModeOption,
      searchTarget: 'name',
      loadingList: false,
      dataList: [],
      selection: [], // 选中的行
      radioVal: 'basic', // 选择材料参数
      dialogVisible: false,
      catalogLazyDialogVisible: false,
      selectedItem: [], // 选中的选项
      selectStatusRes: {}, // 上架状态筛选器的返回值
      selectBrandsRes: {}, // 品牌筛选器的返回值
      ifUpdate: false, // 判断是否刷新数据
      // 翻页参数
      listQuery: {
        page: 1,
        per_page: 20,
        search: undefined
      },
      total: 0,
      tableHeight: 400,
      basicDialogDefault: [
        { name: '产品类型', key: 'product_type', value: -1, span: 12, type: 'dialog', options: ProdutTypeOption, optionProps: { value: 'key', label: 'name' }},
        { name: '可修改尺寸', key: 'change_size', value: 1, span: 8, type: 'switch', options: TrueFalseOption, optionProps: { value: 'key', label: 'name' }},
        { name: '开向', key: 'direction', value: 0, span: 8, type: 'select', options: ProductDirectionOption, optionProps: { value: 'key', label: 'name' }},
        { name: '所属品牌', key: 'brand', value: null, span: 8, type: 'input' },
        { name: '模型路径', key: 'model_path', value: '', span: 8, type: 'input' },
        { name: '预览图', key: 'pic', value: '', span: 24, type: 'input' }
      ],
      basicDialogRules: {},
      sizeDialogDefault: [
        { name: '参数名', key: 'paramunit_name', value: '', span: 12, type: 'input' },
        { name: '参数类型', key: 'param_type', value: 0, span: 12, type: 'select', options: UnitParamTypeOption, optionProps: { value: 'key', label: 'name' }},
        { name: '宽', key: 'l', value: 0, span: 8, type: 'input', inputType: 'number', min: 0 },
        { name: '深', key: 'w', value: 0, span: 8, type: 'input', inputType: 'number', min: 0 },
        { name: '高', key: 'h', value: 0, span: 8, type: 'input', inputType: 'number', min: 0 }
      ],
      sizeDialogRules: {
        l: [{ trigger: 'change', validator: this.validateFunCanNull }],
        w: [{ trigger: 'change', validator: this.validateFunCanNull }],
        h: [{ trigger: 'change', validator: this.validateFunCanNull }]
      },
      doorDialogDefault: [
        { name: '适用所有门板', key: 'all_doorstyle', value: 1, span: 8, type: 'switch', options: TrueFalseOption, optionProps: { value: 'key', label: 'name' }},
        { name: '门板反向限制', key: 'reverse_permit_door_mode', value: 0, span: 8, type: 'switch', options: TrueFalseOption, optionProps: { value: 'key', label: 'name' }},
        { name: '门板限制方案', key: 'door_style_scheme_id', value: null, span: 8, type: 'input', inputType: 'integer' }
      ],
      doorDialogRules: {
        door_style_scheme_id: [{ trigger: 'change', validator: this.validateFunCanNull }]
      },
      lineDialogDefault: [
        { name: '台面眉线', key: 'worktop_mx_line', value: 0, span: 13, type: 'switch', options: TrueFalseOption, optionProps: { value: 'key', label: 'name' }},
        { name: '踢脚灯线', key: 'btm_light_line', value: 0, span: 13, type: 'switch', options: TrueFalseOption, optionProps: { value: 'key', label: 'name' }}
      ],
      lineDialogRules: {},
      positionDialogDefault: [
        { name: '定位方式', key: 'elva_mode', value: 0, span: 13, type: 'dialog', options: ElvaModeOption, optionProps: { value: 'key', label: 'name' }},
        { name: '定位高度', key: 'elva', value: 0, span: 13, type: 'input', inputType: 'number', min: 0 }
      ],
      positionDialogRules: {
        elva: [{ trigger: 'change', validator: this.validateFunCanNull }]
      },
      quoteDialogDefault: [
        { name: '参与报价', key: 'need_quotation', value: 1, span: 8, type: 'switch', options: TrueFalseOption, optionProps: { value: 'key', label: 'name' }},
        { name: '编码', key: 'code', value: '', span: 8, type: 'input' },
        { name: '规格', key: 'standard', value: '0x0x0', span: 8, type: 'input' },
        { name: '颜色', key: 'color', value: '', span: 8, type: 'input' },
        { name: '材料', key: 'material', value: '', span: 8, type: 'input' },
        { name: '单位', key: 'unit', value: '个', span: 8, type: 'input' },
        { name: '单价', key: 'price', value: 0, span: 8, type: 'input', inputType: 'number', min: 0 },
        { name: '备注', key: 'comment', value: '', span: 8, type: 'input' },
        { name: '类型', key: 'class', value: '', span: 8, type: 'input' },
        { name: '扩展信息', key: 'ext1', value: '', span: 8, type: 'input' }
      ],
      quoteDialogRules: {
        price: [{ trigger: 'change', validator: this.validateFunCanNull }]
      },
      otherDialogDefault: [
        { name: '隐藏', key: 'hide', value: 0, span: 13, type: 'switch', options: TrueFalseOption, optionProps: { value: 'key', label: 'name' }},
        { name: '版本', key: 'version', value: '', span: 13, type: 'input' }
      ],
      otherDialogRules: {},
      commonDialogDefault: [], // 对话框的默认信息
      commonDialogRules: {}, // 对话框的验证规则
      commonDialogTitle: '', // 对话框标题
      commonLabelWidth: 'auto', // 对话框表单标签宽度
      updateRow: [] // 已修改的数据
    }
  },
  watch: {
    radioVal(val) {
      this.getUpdateRow()
      this.setColumnsVisible()
    },
    ifUpdate(val) { // 根据selectStatusRes和selectBrandsRes判断是否刷新数据
      if (val) { // 上架状态筛选
        if (Object.keys(this.selectStatusRes).length > 0) {
          if (this.selectStatusRes.all) {
            this.fetchData().then(() => {
              this.brandsFilterFunc()
            })
          } else if (this.selectStatusRes.check.length > 0) {
            this.fetchData().then(() => {
              const temp = []
              for (const item of this.dataList) {
                for (const i of this.selectStatusRes.check) {
                  if (item.status === i) {
                    temp.push(item)
                    break
                  }
                }
              }
              this.dataList = JSON.parse(JSON.stringify(temp))
            }).then(() => {
              this.brandsFilterFunc()
            })
          } else if (this.selectStatusRes.check.length === 0) {
            this.dataList = []
          }
        }

        this.ifUpdate = false
        // this.$refs.tbTable.doLayout()
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.columns = this.$refs.tbTable.getColumns()
      this.setColumnsVisible()
    })
  },
  methods: {
    validateFunCanNull(rule, value, callback) { // 对话框表单验证函数
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
    },
    async loadFun(node, resolve) {
      let pathName = null
      if (node.length !== 0) {
        pathName = node.join('/')
      }
      const { data } = await getProductDir(pathName)
      let res = []
      if (data) {
        res = data.map(val => val.label)
      }
      return resolve(res)
    },
    async fetchData(params) {
      if (params) {
        this.listQuery.page = params.currentPage
        this.listQuery.per_page = params.pageSize
      }
      if (this.selectedItem.length > 0) {
        this.loadingList = true
        const { data } = await getProductList(this.selectedItem.join('\\'), this.listQuery)
        this.dataList = data.items
        this.total = data.total
        this.loadingList = false
      }
    },
    getResult(arr) {
      this.selectedItem = JSON.parse(JSON.stringify(arr))
      if (arr.length > 0) {
        this.fetchData().then(() => {
          this.onResize(true)
        })
      } else {
        this.dataList = []
      }
    },
    brandsFilterFunc() { // 品牌筛选
      if (Object.keys(this.selectBrandsRes).length > 0) {
        if (!this.selectBrandsRes.all) {
          if (this.selectBrandsRes.check.length > 0) {
            const temp = []
            for (const item of this.dataList) {
              for (const i of this.selectBrandsRes.check) {
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
            this.dataList = JSON.parse(JSON.stringify(temp))
          } else if (this.selectBrandsRes.check.length === 0) {
            this.dataList = []
          }
        }
      }
    },
    selectStatus(res) {
      this.selectStatusRes = res
      this.ifUpdate = true
    },
    selectBrands(res) {
      this.selectBrandsRes = res
      this.ifUpdate = true
    },
    onSelected({ row, column }) {
      this.dialogSelected.row = row
      this.dialogSelected.column = column
      let res = {}
      if (column.property === 'product_type') {
        this.dialogSelected.selection = this.produtTypeOption
      } else if (column.property === 'elva_mode') {
        this.dialogSelected.selection = this.elvaModeOption
      }
      res = this.dialogSelected.selection.find((val) => val.key === row[column.property])
      this.dialogSelected.selected = res ? res.name : ''
      this.dialogSelected.visible = true
    },
    changeParams(res) {
      this.dialogSelected.row[this.dialogSelected.column.property] = res.key
    },
    getUpdateRow() {
      this.$refs.tbTable.getUpdateRecords().forEach(val => {
        if (this.updateRow.indexOf(val['_XID']) === -1) {
          this.updateRow.push(val['_XID'])
        }
      })
    },
    saveProperty() {
      this.getUpdateRow() // 保存已修改的目标
      const insertRecords = this.$refs.tbTable.getInsertRecords()
      const updateRecords = []
      for (const item of this.updateRow) {
        updateRecords.push(this.$refs.tbTable.getRowById(item))
      }
      const editedArr = [...insertRecords, ...updateRecords]
      if (insertRecords.length > 0 || updateRecords.length > 0) {
        this.$XModal.confirm({
          message: `新增${insertRecords.length}行，修改${updateRecords.length}行，您确定要保存数据吗?`,
          maskClosable: true, escClosable: true }).then(type => {
          if (type === 'confirm') {
            this.loadingList = true
            updateProduct(editedArr).then(response => {
              this.loadingList = false
              this.updateRow = []
              this.$message.editOk()
              this.fetchData()
            }).catch(() => {
              this.loadingList = false
              this.$XModal.message({ message: '修改失败！', status: 'error' })
            })
          }
        })
      } else {
        this.$XModal.message({ message: '数据未改动！', status: 'info' })
      }
    },
    resetProperty() {
      this.updateRow = []
      this.$XModal.confirm({ message: '您确定要重置数据吗?', maskClosable: true, escClosable: true }).then(type => {
        if (type === 'confirm') {
          this.$refs.tbTable.revertData()
        }
      })
    },
    async addProperty() {
      const tempData = {
        id: null,
        dir1: this.selectedItem[0],
        dir2: this.selectedItem[1],
        dir3: this.selectedItem[2],
        dir4: this.selectedItem[3],
        modelno: '', name: '',
        l: 0, w: 0, h: 0,
        product_type: -1, param_type: 0, paramunit_name: '', model_path: '', pic: '',
        change_size: 1, all_doorstyle: 1, reverse_permit_door_mode: 0,
        door_style_scheme_id: null, direction: 0, brand: null, worktop_mx_line: 0, btm_light_line: 0,
        elva_mode: 0, elva: 0, need_quotation: 1, code: '',
        standard: '0x0x0', color: '', unit: '个',
        price: 0, material: '', comment: '', class: '', ext1: '', version: null, hide: 0,
        params: []
      }
      const { row: newRow } = await this.$refs.tbTable.insertAt(tempData)
      await this.$refs.tbTable.setActiveCell(newRow, 'name')
    },
    copyProperty() {
      const selection = JSON.parse(JSON.stringify(this.selection))
      if (selection.length > 0) {
        copyToClipboard('product_index', selection)
        this.$refs.tbTable.clearCheckboxRow()
        this.selection = []
      } else {
        this.$XModal.message({ message: '未选择！', status: 'info' })
      }
    },
    pasteProperty() {
      const selection = this.selection
      const data = pasteFromClipboard('product_index', true)
      if (data) {
        const length = data.length
        const selectedLength = selection.length
        if (selectedLength > 0) {
          if (length !== selectedLength) {
            this.$XModal.confirm({
              message: `已复制${length}条，可粘贴${selectedLength}条，是否只粘贴前${length >= selectedLength ? selectedLength : length}条`,
              maskClosable: true, escClosable: true }).then(type => {
              if (type === 'confirm') {
                if (length > selectedLength) { // 选择多于已复制，粘贴所有已复制
                  for (const index in selection) {
                    Object.assign(selection[index], data[index])
                  }
                } else if (length < selectedLength) { // 选择数x少于已复制数y，粘贴数据为已复制数据的前x条
                  for (const index in data) {
                    Object.assign(selection[index], data[index])
                  }
                }
                this.$notify({ title: 'Success', message: '粘贴成功', type: 'success', duration: 2000 })
              }
            })
          } else {
            for (const index in data) {
              Object.assign(selection[index], data[index])
              this.$notify({ title: 'Success', message: '粘贴成功', type: 'success', duration: 2000 })
            }
          }
        } else {
          this.$XModal.confirm({ message: '未选择目标，将添加行后粘贴', maskClosable: true, escClosable: true }).then(type => {
            if (type === 'confirm') {
              this.$refs.tbTable.insert(data).then(({ row: newRow }) => {
                this.$refs.tbTable.setActiveCell(newRow, 'name')
                this.$notify({ title: 'Success', message: '添加并粘贴成功', type: 'success', duration: 2000 })
              })
            }
          })
        }
        this.$refs.tbTable.clearCheckboxRow()
        this.selection = []
      }
    },
    closeDialog(target) {
      if (target === 'dialog') {
        this.dialogVisible = false
      } else if (target === 'catalog') {
        this.catalogLazyDialogVisible = false
      } else if (target === 'dialogSelect') {
        this.dialogSelected.visible = false
        return
      }
      this.$refs.tbTable.clearCheckboxRow() // 清空选项
      this.selection = []
    },
    selectMaterial() {
      if (this.radioVal === '') {
        this.$XModal.message({ message: '未选择编辑功能', status: 'info' })
      } else {
        // 获取所有列配置
        if (this.selection.length > 0) {
          if (this.radioVal === 'basic') {
            this.commonDialogDefault = this.basicDialogDefault
            this.commonDialogRules = this.basicDialogRules
            this.commonDialogTitle = '修改基础信息'
            this.commonLabelWidth = '80px'
            this.dialogVisible = true
          } else if (this.radioVal === 'size') {
            this.commonDialogDefault = this.sizeDialogDefault
            this.commonDialogRules = this.sizeDialogRules
            this.commonDialogTitle = '修改尺寸'
            this.commonLabelWidth = '65px'
            this.dialogVisible = true
          } else if (this.radioVal === 'door') {
            this.commonDialogDefault = this.doorDialogDefault
            this.commonDialogRules = this.doorDialogRules
            this.commonDialogTitle = '修改门板属性'
            this.commonLabelWidth = '95px'
            this.dialogVisible = true
          } else if (this.radioVal === 'line') {
            this.commonDialogDefault = this.lineDialogDefault
            this.commonDialogRules = this.lineDialogRules
            this.commonDialogTitle = '修改线条属性'
            this.commonLabelWidth = '65px'
            this.dialogVisible = true
          } else if (this.radioVal === 'position') {
            this.commonDialogDefault = this.positionDialogDefault
            this.commonDialogRules = this.positionDialogRules
            this.commonDialogTitle = '修改定位'
            this.commonLabelWidth = '65px'
            this.dialogVisible = true
          } else if (this.radioVal === 'quote') {
            this.commonDialogDefault = this.quoteDialogDefault
            this.commonDialogRules = this.quoteDialogRules
            this.commonDialogTitle = '修改报价数据'
            this.commonLabelWidth = '65px'
            this.dialogVisible = true
          } else if (this.radioVal === 'other') {
            this.commonDialogDefault = this.otherDialogDefault
            this.commonDialogRules = this.otherDialogRules
            this.commonDialogTitle = '修改其他属性'
            this.commonLabelWidth = '45px'
            this.dialogVisible = true
          } else if (this.radioVal === 'catalog') {
            this.catalogLazyDialogVisible = true
          }
        } else {
          this.$XModal.message({ message: '未选择！', status: 'info' })
        }
      }
    },
    handleSelectionChange(data) {
      this.selection = data.records
    },
    onDelete(row) {
      if (this.selection.length > 0) {
        this.$XModal.confirm({ message: '您确定要删除数据?', maskClosable: true, escClosable: true }).then(type => {
          if (type === 'confirm') {
            const target = []
            for (const item of this.selection) {
              const index = this.$refs.tbTable.getRowIndex(item)
              if (index < 0) {
                this.$refs.tbTable.remove(item)
              } else {
                target.push(item.id)
              }
            }
            if (target.length > 0) {
              this.loadingList = true
              deleteProduct(target).then(response => {
                for (const item of this.selection) {
                  const tempIndex = this.updateRow.indexOf(item['_XID'])
                  if (tempIndex > -1) {
                    this.updateRow.splice(tempIndex, 1)
                  }
                }
                this.loadingList = false
                this.$notify.deleteOk()
                this.fetchData()
              }).catch(() => {
                this.$XModal.message({ message: '删除失败！', status: 'error' })
                this.loadingList = false
              })
            }
          }
        })
      } else {
        this.$XModal.message({ message: '未选择！', status: 'info' })
      }
    },
    onSearch() {
      this.listQuery.page = 1
      this.fetchData()
    },
    onResize(show) {
      setTimeout(() => {
        this.tableHeight = window.innerHeight - document.querySelector('.app-main').offsetTop - this.$refs.tbTable.$el.offsetTop - 20 - 48 // padding-bottom:20px,vxe-pager:48px
      }, 500)
    },
    editMethod({ row, column }) {
      // 重写默认的覆盖式，改为追加式
      this.$refs.tbTable.setActiveCell(row, column.property)
      // 返回 false 阻止默认行为
      return false
    },
    setColumnsVisible() { // 分类显示列
      this.$refs.tbTable.resetColumn()
      const columns = this.columns
      function setVisible(arr) {
        columns.forEach(column => {
          if (column.type !== 'checkbox' &&
            column.type !== 'seq' &&
            column.title !== '删除' &&
            column.property !== 'name' &&
            column.property !== 'modelno') {
            if (arr.length > 0) {
              for (const item of arr) {
                if (column.property === item) {
                  column.visible = true
                  break
                } else {
                  column.visible = false
                }
              }
            } else {
              column.visible = false
            }
          }
        })
      }
      if (this.radioVal === '') {
        setVisible([])
      } else if (this.radioVal === 'basic') {
        setVisible(['product_type', 'change_size', 'direction', 'brand', 'model_path', 'pic'])
      } else if (this.radioVal === 'catalog') {
        setVisible(['dir1', 'dir2', 'dir3', 'dir4'])
      } else if (this.radioVal === 'size') {
        setVisible(['paramunit_name', 'param_type', 'l', 'w', 'h'])
      } else if (this.radioVal === 'door') {
        setVisible(['all_doorstyle', 'reverse_permit_door_mode', 'door_style_scheme_id'])
      } else if (this.radioVal === 'line') {
        setVisible(['worktop_mx_line', 'btm_light_line'])
      } else if (this.radioVal === 'position') {
        setVisible(['elva_mode', 'elva'])
      } else if (this.radioVal === 'quote') {
        setVisible(['need_quotation', 'code', 'standard', 'color', 'material', 'unit', 'price', 'comment', 'class', 'ext1'])
      } else if (this.radioVal === 'other') {
        setVisible(['hide', 'version'])
      }
      if (this.$refs.tbTable) {
        this.$refs.tbTable.refreshColumn()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-list{
  display: flex;
  left: 0px;
  align-items: center;
}
.menu-item{
  display: flex;
  align-items: center;
  margin-right: 20px;
}
</style>
