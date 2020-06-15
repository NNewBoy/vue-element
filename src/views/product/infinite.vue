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
            <el-dropdown-item command>更多属性</el-dropdown-item>
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
          <el-button v-show="openBtn" type="primary" size="mini" @click="addProperty">添加</el-button>
          <el-button v-show="openBtn" type="primary" size="mini" @click="copyProperty">复制</el-button>
          <el-button v-show="openBtn" type="primary" size="mini" @click="pasteProperty">粘贴</el-button>
          <el-button v-show="openBtn" type="primary" size="mini" @click="pasteAndAddProperty">添加并粘贴</el-button>
          <el-button type="primary" size="mini" :icon="openBtn?'el-icon-arrow-left':'el-icon-arrow-right'" @click="openBtn = !openBtn" />
        </el-button-group>
      </div>
    </div>
    <br>
    <el-table
      ref="tbTable"
      v-loading="loadingList"
      v-el-table-infinite-scroll="loadNextPage"
      :data="dataList"
      :row-style="tableRowStyle"
      element-loading-text="Loading"
      :height="tableHeight"
      border
      fit
      highlight-current-row
      class="tb-edit"
      @selection-change="handleSelectionChange"
      @cell-click="onClickTb"
    >
      <el-table-column type="selection" width="45" />
      <el-table-column align="center" label="ID" width="50">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column label="删除" align="center" width="82" class-name="mini-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button
            v-if="row.status!='deleted'"
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="onDelete(row,$index)"
          />
        </template>
      </el-table-column>

      <CommonColumn label="名称" min-width="200" value="name" />
      <CommonColumn label="型号" min-width="200" value="modelno" />
      <!-- 基础信息 -->
      <div v-if="radioVal==='basic'">
        <ButtonColumn label="产品类型" width="150" value="product_type" :data-list="ProdutTypeOption" @onSelect="onSelectProduct" />
        <SwitchColumn label="可修改尺寸" width="100" value="change_size" />
        <SelectColumn label="开向" width="100" value="direction" :data-list="ProductDirectionOption" />
        <CommonColumn label="所属品牌" width="100" value="brand" />
        <CommonColumn label="模型路径" width="100" value="model_path" />
        <CommonColumn label="预览图" width="200" value="pic" />
      </div>
      <!-- 目录 -->
      <div v-if="radioVal==='catalog'">
        <div v-for="item in 4" :key="item">
          <CommonColumn :label="'目录'+item" width="100" :value="'dir'+item" />
        </div>

      </div>
      <!-- 尺寸 -->
      <div v-if="radioVal==='size'">
        <CommonColumn label="参数名" width="200" value="paramunit_name" />
        <SelectColumn label="参数类型" width="150" value="param_type" :data-list="UnitParamTypeOption" />
        <CommonColumn label="宽" width="100" value="l" />
        <CommonColumn label="深" width="100" value="w" />
        <CommonColumn label="高" width="100" value="h" />
      </div>
      <!-- 门板属性 -->
      <div v-if="radioVal==='door'">
        <SwitchColumn label="适用所有门板" width="120" value="all_doorstyle" />
        <SwitchColumn label="门板反向限制" width="120" value="reverse_permit_door_mode" />
        <CommonColumn label="门板限制方案" width="120" value="door_style_scheme_id" />
      </div>
      <!-- 线条属性 -->
      <div v-if="radioVal==='line'">
        <SwitchColumn label="台面眉线" width="100" value="worktop_mx_line" />
        <SwitchColumn label="踢脚灯线" width="100" value="btm_light_line" />
      </div>
      <!-- 定位 -->
      <div v-if="radioVal==='position'">
        <ButtonColumn label="定位方式" width="200" value="elva_mode" :data-list="ElvaModeOption" @onSelect="onSelect" />
        <CommonColumn label="定位高度" width="100" value="elva" />
      </div>
      <!-- 报价数据 -->
      <div v-if="radioVal==='quote'">
        <SwitchColumn label="参与报价" width="100" value="need_quotation" />
        <CommonColumn label="编码" width="120" value="code" />
        <CommonColumn label="规格" width="150" value="standard" />
        <CommonColumn label="颜色" width="100" value="color" />
        <CommonColumn label="材料" width="100" value="material" />
        <CommonColumn label="单位" width="80" value="unit" />
        <CommonColumn label="单价" width="100" value="price" />
        <CommonColumn label="备注" width="150" value="comment" />
        <CommonColumn label="类型" width="100" value="class" />
        <CommonColumn label="扩展信息" width="100" value="ext1" />
      </div>
      <!-- 其他 -->
      <div v-if="radioVal==='other'">
        <SwitchColumn label="隐藏" width="100" value="hide" />
        <CommonColumn label="版本" width="120" value="version" />
      </div>

    </el-table>

    <SelectDialog
      title="选择定位方式"
      :dialog-visible="positionSelectDialogVisible"
      :table-data="ElvaModeOption"
      :selected="positionSelected.selected"
      @closeSelectDialog="closeDialog('positionSelect')"
      @getSelected="changePosition"
    />
    <SelectDialog
      title="选择产品类型"
      :dialog-visible="productSelectDialogVisible"
      :table-data="ProdutTypeOption"
      :selected="productSelected.selected"
      @closeSelectDialog="closeDialog('productSelect')"
      @getSelected="changeProduct"
    />
    <CatalogLazyDialog
      :catalog-dialog-visible="catalogLazyDialogVisible"
      :material-checkbox-val="selection"
      :table-data="dataList"
      :from-catalog="selectedItem"
      search-target="name"
      @closeCatalogDialog="closeDialog('catalog')"
      @returnCatalog="changeCatalog"
    />

    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.per_page" @pagination="fetchData" /> -->
  </div>
</template>

<script type="text/javascript">
import elTableInfiniteScroll from 'el-table-infinite-scroll'
import { editDelete } from '@/utils/edit'
import { confirmEdit } from '@/utils/edit'
import { getProductDir, getProductList, updateProduct, deleteProduct } from '@/api/product'
import LazyFilter from '@/components/LazyFilter'
import CommonColumn from '@/components/MaterialEdit/column/CommonColumn'
import SelectColumn from '@/components/MaterialEdit/column/SelectColumn'
import SwitchColumn from '@/components/MaterialEdit/column/SwitchColumn'
import ButtonColumn from '@/components/MaterialEdit/column/ButtonColumn'
import BrandsFilter from '@/components/MaterialEdit/filter/BrandsFilter'
import StatusFilter from '@/components/MaterialEdit/filter/StatusFilter'
import Collapse from '@/components/Collapse'
import CatalogLazyDialog from '@/components/MaterialEdit/dialog/CatalogLazyDialog'
import SelectDialog from '@/components/MaterialEdit/dialog/SelectDialog'
import { copyToClipboard, pasteFromClipboard } from '@/utils/clipboard'
// import Pagination from '@/components/Pagination'

export default {
  directives: {
    'el-table-infinite-scroll': elTableInfiniteScroll
  },
  components: { LazyFilter, CommonColumn, SelectColumn, SwitchColumn, ButtonColumn, BrandsFilter, StatusFilter, Collapse, CatalogLazyDialog, SelectDialog /*, Pagination*/ },
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
      searchText: '',
      searchTarget: 'name',
      loadingList: false,
      dataList: [],
      selection: [], // 选中的行
      radioVal: '', // 选择材料参数
      positionSelectDialogVisible: false,
      positionSelected: {
        row: {},
        selected: ''
      }, // 当前选中的定位方式
      productSelectDialogVisible: false,
      productSelected: {
        row: {},
        selected: ''
      }, // 当前选中的产品类型
      basicDialogVisible: false,
      catalogLazyDialogVisible: false,
      sizeDialogVisible: false,
      doorDialogVisible: false,
      lineDialogVisible: false,
      positionDialogVisible: false,
      quoteDialogVisible: false,
      otherDialogVisible: false,
      selectedItem: [], // 选中的选项
      selectStatusRes: {}, // 上架状态筛选器的返回值
      selectBrandsRes: {}, // 品牌筛选器的返回值
      ifUpdate: false, // 判断是否刷新数据
      openBtn: false, // 编辑按钮打开与否
      // 翻页参数
      listQuery: {
        page: 1,
        per_page: 20,
        search: undefined
      },
      total: 0,
      tableHeight: 400,
      ProdutTypeOption: [{ text: '无', value: -1 }, { text: '地柜', value: 0 }, { text: '吊柜', value: 1 }, { text: '高柜', value: 2 }, { text: '洗衣机', value: 3 }, { text: '冰箱', value: 4 }, { text: '油烟机', value: 5 }, { text: '装饰柜', value: 6 }, { text: '星盆', value: 7 }, { text: '炉灶', value: 8 }, { text: '拉手', value: 9 }, { text: '其它', value: 10 }, { text: '半高柜', value: 11 }, { text: '烤箱(烤箱定位)', value: 12 }, { text: '微波炉(内置电器)', value: 13 }, { text: '消毒柜', value: 14 }, { text: '洗碗机', value: 15 }, { text: '铝脚', value: 16 }, { text: '水位设施', value: 17 }, { text: '电位设施', value: 18 }, { text: '气位设施', value: 19 }, { text: '拉篮', value: 20 }, { text: '水龙头', value: 21 }, { text: '独立浴缸', value: 22 }, { text: '地台浴缸', value: 23 }, { text: '高淋浴房', value: 24 }, { text: '挂盆', value: 25 }, { text: '柱盆', value: 26 }, { text: '马桶', value: 27 }, { text: '热水器', value: 28 }, { text: '衣柜功能件', value: 29 }, { text: '底架', value: 30 }, { text: '房门', value: 31 }, { text: '窗', value: 32 }, { text: '电饭煲', value: 33 }, { text: '米箱', value: 34 }, { text: '垃圾桶', value: 35 }, { text: '集成炉灶(环保灶)', value: 36 }, { text: '集成水槽', value: 37 }, { text: '博古架', value: 38 }, { text: '酒格', value: 39 }],
      ProductDirectionOption: [{ text: '任意', value: 0 }, { text: '左开', value: 1 }, { text: '右开', value: 2 }],
      UnitParamTypeOption: [{ text: '普通单元', value: 0 }, { text: '结构固定单元', value: 1 }, { text: '自定义结构单元', value: 2 }],
      ElvaModeOption: [{ text: '在地面', value: 0 }, { text: '在踢脚板', value: 1 }, { text: '位于吊柜离地高度', value: 2 }, { text: '在台面上', value: 3 }, { text: '在台面上(选柜定位)', value: 4 }, { text: '在台面中(选柜定位)', value: 5 }, { text: '在台面下(选柜定位)', value: 6 }, { text: '在选择的物体上', value: 7 }, { text: '在选择的物体下', value: 8 }, { text: '在特定的高度上', value: 9 }, { text: '在特定高(选柜定位)', value: 10 }, { text: '在特定的高度下', value: 11 }, { text: '内置电器	', value: 12 }, { text: '自由定位(表面吸附)', value: 13 }, { text: '背板定位', value: 14 }, { text: '电器自动适配大小定位', value: 15 }, { text: '在选择的层板上(或下)', value: 16 }, { text: '柜层板定位', value: 17 }, { text: '墙面定位(底部贴墙)', value: 18 }, { text: '地面定位', value: 19 }, { text: '拉篮定位', value: 20 }, { text: 'DoorBell墙挂式定位', value: 21 }, { text: '随目标定位位置', value: 22 }, { text: '油烟机定位', value: 23 }, { text: '在特定高(选2立柱定位)', value: 24 }, { text: '在特定高(选3立柱定位)', value: 25 }, { text: '选4柱定位', value: 26 }, { text: 'Rayes墙挂式定位', value: 27 }, { text: '多宝格定位', value: 28 }, { text: '罗马柱定位', value: 29 }, { text: '立隔板定位', value: 30 }, { text: '层板下的横向挂衣杆定位', value: 31 }, { text: '层板下的纵向挂衣杆定位', value: 32 }, { text: '左装饰条定位', value: 33 }, { text: '右装饰条定位', value: 34 }, { text: '中装饰条定位', value: 35 }, { text: '趟门框定位', value: 36 }, { text: '门上定位', value: 37 }, { text: '柜两侧定位', value: 38 }, { text: 'order床栏杆安装', value: 39 }, { text: 'order床安装', value: 40 }, { text: 'order床下书桌安装', value: 41 }, { text: '油烟机烟板定位', value: 42 }, { text: '大衣柜外框定位', value: 43 }, { text: '备用', value: 44 }, { text: '自由定位(以基点为鼠标点)', value: 45 }, { text: '前缘饰板定位', value: 46 }, { text: '床身定位', value: 47 }, { text: '墙面定位(背后贴墙)', value: 48 }, { text: '眉板定位', value: 49 }, { text: 'centro床安装', value: 50 }, { text: '多维尚书门板、抽屉定位方式', value: 51 }, { text: '水电位定位', value: 52 }, { text: '转角罗马柱定位', value: 53 }, { text: '柜身前定位', value: 54 }, { text: '灯箱底板定位', value: 55 }, { text: '西门子logo定位', value: 56 }, { text: '苏黎世左装饰条定位', value: 57 }, { text: '苏黎世右装饰条定位', value: 58 }, { text: '苏黎世中装饰条定位', value: 59 }, { text: '门板/抽屉定位', value: 60 }, { text: '榻榻米门板', value: 61 }, { text: '产品前面定位', value: 62 }, { text: '产品后面定位', value: 63 }, { text: '产品左面定位', value: 64 }, { text: '产品右面定位', value: 65 }, { text: '产品顶面定位', value: 66 }, { text: '顶柜定位', value: 67 }, { text: '飘窗顶柜定位', value: 68 }, { text: '选板定位', value: 69 }, { text: '套格定位', value: 70 }, { text: '门板定位', value: 71 }, { text: '形门板定位', value: 72 }]
    }
  },
  computed: {

  },
  watch: {
    radioVal(val) {
      this.$nextTick(() => {
        this.$refs.tbTable.doLayout()
      })
    },
    ifUpdate(val) { // 根据selectStatusRes和selectBrandsRes判断是否刷新数据
      if (val) { // 上架状态筛选
        this.searchText = ''
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
        this.$refs.tbTable.doLayout()
      }
    }
  },
  mounted() {

  },
  methods: {
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
    async fetchData() {
      this.listQuery.page = 1
      if (this.selectedItem.length > 0) {
        this.loadingList = true
        const { data } = await getProductList(this.selectedItem.join('\\'), this.listQuery)
        data.items.forEach(el => { el.changed = false })
        this.dataList = data.items
        this.total = data.total
        this.loadingList = false
        console.log(this.dataList)
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
    tableRowStyle({ row, rowIndex }) {
      return row.changed === 1 ? { 'background-color': 'PeachPuff' } : ''
    },
    selectStatus(res) {
      this.selectStatusRes = res
      this.ifUpdate = true
    },
    selectBrands(res) {
      this.selectBrandsRes = res
      this.ifUpdate = true
    },
    onSelect(row) {
      const res = this.ElvaModeOption.filter((val) => val.value === row.elva_mode)
      this.positionSelected.row = row
      this.positionSelected.selected = res[0] ? res[0].text : ''
      this.positionSelectDialogVisible = true
    },
    changePosition(position) {
      this.positionSelected.row.elva_mode = position.value
      this.positionSelected.row.changed = 1
    },
    onSelectProduct(row) {
      const res = this.ProdutTypeOption.filter((val) => val.value === row.product_type)
      this.productSelected.row = row
      this.productSelected.selected = res[0] ? res[0].text : ''
      this.productSelectDialogVisible = true
    },
    changeProduct(product) {
      this.productSelected.row.product_type = product.value
      this.productSelected.row.changed = 1
    },
    changeCatalog(catalog) { // 移动目录
      confirmEdit(() => {
        for (const item of catalog.id) {
          const index = this.dataList.findIndex(v => v.id === item)
          this.dataList[index].changed = 1
          this.dataList[index].dir1 = catalog.to[0]
          this.dataList[index].dir2 = catalog.to[1]
          this.dataList[index].dir3 = catalog.to[2]
          this.dataList[index].dir4 = catalog.to[3]
          this.$refs.tbTable.doLayout()
        }
        // const editedArr = this.dataList.filter(item => item.changed === 1)
        this.loadingList = true
        // updateMat(editedArr)
        //   .then(response => {
        this.loadingList = false
        this.$message.editOk()
        // this.fetchData()
        // })
        // .catch(() => {
        //   this.loadingList = false
        //   this.$notify.editError()
        // })
      })
      this.$refs.tbTable.clearSelection() // 清空选项
    },
    saveProperty() {
      const editedArr = this.dataList.filter(item => item.changed)
      if (editedArr.length > 0) {
        confirmEdit(() => {
          this.loadingList = true
          updateProduct(editedArr).then(response => {
            this.loadingList = false
            this.$message.editOk()
            this.fetchData()
          }).catch(() => {
            this.loadingList = false
            this.$notify.editError()
          })
        })
      }
    },
    resetProperty() {
      this.searchText = ''
      this.$refs.tbTable.$el.querySelector('.el-table__body-wrapper').scrollTop = 0 // 滚回顶部，避免触底无限渲染
      this.fetchData()
    },
    addProperty() {
      const tempData = {
        id: null,
        dir1: this.selectedItem[0],
        dir2: this.selectedItem[1],
        dir3: this.selectedItem[2],
        dir4: this.selectedItem[3],
        modelno: '', name: '',
        l: 800, w: 450, h: 18,
        product_type: -1, param_type: 0, paramunit_name: '', model_path: '', pic: '',
        change_size: 1, all_doorstyle: 1, reverse_permit_door_mode: 0,
        door_style_scheme_id: null, direction: 0, brand: null, worktop_mx_line: 0, btm_light_line: 0,
        elva_mode: 0, elva: 0, need_quotation: 1, code: '',
        standard: '800x450x18', color: '', unit: '个',
        price: 0, material: '', comment: '', class: '', ext1: '', version: null, hide: 0,
        params: [],
        changed: 1
      }
      this.dataList.unshift(tempData)
      this.$refs.tbTable.setCurrentRow(0)
    },
    copyProperty() {
      if (this.selection.length > 0) {
        const temp = JSON.parse(JSON.stringify(this.selection))
        temp.forEach(el => {
          el.id = null
        })
        copyToClipboard('product_index', temp)
        this.$refs.tbTable.clearSelection()
      } else {
        this.$confirm('未选择材质', '警告', {
          showCancelButton: false,
          confirmButtonText: '确认',
          type: 'warning'
        }).catch(() => {

        })
      }
    },
    pasteProperty() {
      if (this.selection.length > 0) {
        const data = pasteFromClipboard('product_index')
        if (data) {
          const length = data.length
          const selectedLength = this.selection.length
          if (length !== selectedLength) {
            this.$confirm(
              `已复制${length}条，可粘贴${selectedLength}条，是否只粘贴前${length >= selectedLength ? selectedLength : length}条`,
              '复制数量与粘贴数量不一致', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
              if (length > selectedLength) { // 选择多于已复制，粘贴所有已复制
                for (const index in this.selection) {
                  for (const item in data[index]) {
                    if (item !== 'id') { this.selection[index][item] = data[index][item] }
                  }
                  this.selection[index].changed = 1
                }
              } else if (length < selectedLength) { // 选择数x少于已复制数y，粘贴数据为已复制数据的前x条
                for (const index in data) {
                  for (const item in data[index]) {
                    if (item !== 'id') { this.selection[index][item] = data[index][item] }
                  }
                  this.selection[index].changed = 1
                }
              }
            }).catch(() => {})
          } else {
            for (const index in data) {
              for (const item in data[index]) {
                if (item !== 'id') { this.selection[index][item] = data[index][item] }
              }
              this.selection[index].changed = 1
            }
          }
        }
        this.$refs.tbTable.clearSelection()
      } else {
        this.$confirm('未选择材质', '警告', {
          showCancelButton: false,
          confirmButtonText: '确认',
          type: 'warning'
        }).catch(() => {})
      }
    },
    pasteAndAddProperty() {
      const data = pasteFromClipboard('product_index')
      if (data) {
        data.map(item => {
          item.changed = 1
        })
        this.dataList.unshift(...data)
        this.$refs.tbTable.clearSelection()
        this.$refs.tbTable.setCurrentRow(0)
      }
    },
    onClickTb(row, column, cell, event) { // 表格聚焦
      this.$nextTick(() => {
        const input = cell.querySelector('input')
        if (input) {
          input.focus()
        }
      })
    },
    closeDialog(target) {
      if (target === 'basic') {
        this.basicDialogVisible = false
      } else if (target === 'catalog') {
        this.catalogLazyDialogVisible = false
      } else if (target === 'size') {
        this.sizeDialogVisible = false
      } else if (target === 'door') {
        this.doorDialogVisible = false
      } else if (target === 'line') {
        this.lineDialogVisible = false
      } else if (target === 'position') {
        this.positionDialogVisible = false
      } else if (target === 'quote') {
        this.quoteDialogVisible = false
      } else if (target === 'other') {
        this.otherDialogVisible = false
      } else if (target === 'positionSelect') {
        this.positionSelectDialogVisible = false
      } else if (target === 'productSelect') {
        this.productSelectDialogVisible = false
      }
      this.$refs.tbTable.clearSelection() // 清空选项
    },
    selectMaterial() {
      if (this.radioVal === '') {
        this.$confirm('未选择编辑功能', '警告', {
          showCancelButton: false,
          confirmButtonText: '确认',
          type: 'warning'
        }).catch(() => {})
      } else {
        if (this.selection.length > 0) {
          if (this.radioVal === 'basic') {
            this.basicDialogVisible = true
          } else if (this.radioVal === 'catalog') {
            this.catalogLazyDialogVisible = true
          } else if (this.radioVal === 'size') {
            this.sizeDialogVisible = true
          } else if (this.radioVal === 'door') {
            this.doorDialogVisible = true
          } else if (this.radioVal === 'line') {
            this.lineDialogVisible = true
          } else if (this.radioVal === 'position') {
            this.positionDialogVisible = true
          } else if (this.radioVal === 'quote') {
            this.quoteDialogVisible = true
          } else if (this.radioVal === 'other') {
            this.otherDialogVisible = true
          }
        } else {
          this.$confirm('未选择材质', '警告', {
            showCancelButton: false,
            confirmButtonText: '确认',
            type: 'warning'
          }).catch(() => {})
        }
      }
    },
    handleSelectionChange(selection) {
      this.selection = selection
    },
    onDelete(row, index) {
      editDelete(() => {
        this.loadingList = true
        deleteProduct(row.id).then(response => {
          this.$notify.deleteOk()
          this.dataList.splice(index, 1)
          this.loadingList = false
        }).catch(() => {
          this.loadingList = false
        })
      })
    },
    onSearch() {
      this.listQuery.page = 1
      this.fetchData()
    },
    async loadNextPage() {
      this.listQuery.page++
      const { data } = await getProductList(this.selectedItem.join('\\'), this.listQuery)
      if (data && data.items) {
        data.items.forEach(el => { el.changed = false })
        this.dataList = this.dataList.concat(data.items)
      }
    },
    onResize(show) {
      setTimeout(() => {
        this.tableHeight = window.innerHeight - document.querySelector('.app-main').offsetTop - this.$refs.tbTable.$el.offsetTop - 20
      }, 500)
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
