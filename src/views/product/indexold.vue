<template>
  <div class="components-container">
    <split-pane split="vertical" :min-percent="5" :default-percent="15" @resize="resize">
      <template slot="paneL">
        <div class="filter-container">
          <el-autocomplete
            v-model="filterText"
            :fetch-suggestions="querySearchMethod"
            placeholder="查找型号"
            size="mini"
            clearable
          >
            <template slot-scope="{ item }">
              <div class="name">{{ item.label }}</div>
            </template>
          </el-autocomplete>
          <el-button
            class="filter-item"
            type="primary"
            size="mini"
            :icon="inSearch?'el-icon-close':'el-icon-search'"
            :disabled="!enableSearch"
            @click="handleSearch"
          />
        </div>
        <el-table
          v-show="inSearch"
          :data="listProduct"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          @row-click="clickSearchProduct"
        >
          <el-table-column label="产品列表" style="width: 100%;" align="center">
            <template slot-scope="{row}">{{ row.modelno }}</template>
          </el-table-column>
        </el-table>
        <div v-show="!inSearch" class="left-container">
          <div style="height:300px">
            <el-tree
              ref="tree"
              width="600px"
              height="600px"
              show-checkbox
              :data="node"
              node-key="modelno"
              :expand-on-click-node="false"
              :props="props"
              :highlight-current="true"
              :filter-node-method="filterNode"
              class="filter-tree"
              @node-click="nodeClick"
            />
          </div>
          <div class="footer">
            <el-col :span="4">
              <el-button type="warning" icon="el-icon-download" @click="downloadProducts()">
                批量下载产品
              </el-button>
            </el-col>
          </div>
        </div>
      </template>
      <template slot="paneR">
        <el-tabs
          v-model="activeName"
          style="margin-top:0px;height:90%;overflow-y:auto;overflow-x:hidden;"
          type="border-card"
        >
          <el-tab-pane label="属性编辑" name="product">
            <product-thead v-if="product || searchProduct" :form="currentProduct" @delete="deleteNode" />
          </el-tab-pane>
          <el-tab-pane label="参数列表" name="param">
            <param-list v-if="product || searchProduct" :product="currentProduct" />
          </el-tab-pane>
          <el-tab-pane label="安装设置" name="fixprops">
            <fix-setting />
          </el-tab-pane>
        </el-tabs>
      </template>
    </split-pane>
  </div>
</template>

<script>
import { getProductDir, getProductInfo, searchProduct, getAllProductDir } from '@/api/product'
import splitPane from 'vue-splitpane'
import ProductThead from './components/ProductThead'
import ParamList from './components/ParamList'
import FixSetting from './components/FixSetting'
import Cookies from 'js-cookie'
export default {
  components: { splitPane, ProductThead, FixSetting, ParamList },
  data() {
    return {
      filterText: '',
      filterList: [],
      breadList: [],
      node: [],
      props: {
        children: 'children',
        label: 'label',
        isLeaf: 'leaf'
      },
      activeName: 'product',
      product: null,
      searchProduct: null,
      listProduct: null,
      inSearch: false
    }
  },
  computed: {
    enableSearch: function() {
      return this.filterText.length >= 2
    },
    currentProduct: function() {
      if (this.inSearch) {
        return this.searchProduct
      } else {
        return this.product
      }
    }
  },
  watch: {
  },
  created() {
    if (Cookies.get('productSearch')) {
      this.filterList = Cookies.get('productSearch').split('&')
      if (this.filterList.length > 0) {
        this.filterText = this.filterList[0]
      }
    }
    this.fetchTreeStruct()
  },
  methods: {
    resize() {
      // console.log('resize')
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 下面两个函数是懒加载用的
    getTreeNode(node) { // 获取当前树节点和其父级节点
      if (node) {
        if (node.label !== undefined) {
          this.breadList.unshift(node.label) // 在数组头部添加元素
          this.getTreeNode(node.parent) // 递归
        }
      }
    },
    async loadPath(node, resolve) {
      // console.log(node)
      let pathName = null
      if (node.level !== 0) {
        this.breadList = []
        this.getTreeNode(node)
        pathName = this.breadList.join('/')
      }
      const { data } = await getProductDir(pathName)
      return resolve(data)
    },
    // 下面函数不采用懒加载获取树结构，为后面批量下载准备数据
    async fetchTreeStruct() {
      const { data } = await getAllProductDir()
      this.node = data
    },
    async fetchProduct(modelno) {
      if (modelno) {
        const { data } = await getProductInfo(modelno)
        if (this.inSearch) {
          this.searchProduct = data
          this.searchProduct.isNew = false
        } else {
          this.product = data
          this.product.isNew = false
        }
      }
    },
    nodeClick(node) {
      if (!node.leaf) {
        return
      }
      this.fetchProduct(node.level === 4 ? null : node.modelno)
    },
    async clickSearchProduct(row) {
      const { data } = await getProductInfo(row.modelno)
      this.searchProduct = data
      this.searchProduct.isNew = false
    },
    async handleSearch() {
      this.productLoading = true
      const { data } = await searchProduct(this.filterText)
      this.listProduct = data

      for (let i = 0; i < this.filterList.length; i++) {
        if (this.filterList[i] === this.filterText) {
          this.filterList.splice(i--, 1)
        }
      }

      this.filterList.unshift(this.filterText)
      this.productLoading = false

      Cookies.set('productSearch', this.filterList.join('&'))
      this.inSearch = !this.inSearch
    },
    querySearchMethod(queryString, cb) {
      const that = this
      var solList = []
      that.filterList.forEach(item => {
        solList.push({ 'label': item, 'value': item })
      })

      const results = solList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    deleteNode(modelno) {
      if (!this.inSearch) {
        this.$refs.tree.remove(modelno)
      } else {
        this.listProduct = this.listProduct.filter(item => item.modelno !== modelno)
      }
    },
    downloadProducts() {
      const checkNodes = this.$refs.tree.getCheckedNodes(true, false)
      var modelnos = []
      checkNodes.forEach(element => {
        modelnos.push(element.modelno)
      })
      window.DownloadProducts(JSON.stringify(modelnos))
    }
  }
}
</script>

<style  scoped>
.components-container {
  position: relative;
  height: 800px;
}

.left-container {
  /* background-color: #F38181; */
  height: 100%;
}

.right-container {
  /* background-color: #FCE38A; */
  height: 800px;
}

.top-container {
  /* background-color: #FCE38A; */
  width: 100%;
  height: 100%;
}

.bottom-container {
  width: 100%;
  /* background-color: #95E1D3; */
  height: 100%;
}

.filter-container {
  display: inline;
}

.footer {
  position: absolute;
  bottom: 0px;
  margin: 0px;
  width: 100%;
  height: 60px;
  display: block;
}
</style>
