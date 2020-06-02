<template>
  <div style="display: block">
    <div v-if="showDir1" class="dir-container">
      <span class="title-item">材质分类</span>
      <span>
        <el-tag
          v-for="(item, index) in datas"
          :key="index"
          :effect="item.selected ? 'dark' : 'plain' "
          style="border:none;margin-left: 10px;font-size: 16px; line-height: 33px;"
          class="el-tag-pointer"
          @click="onSelectDir1(index)"
        >
          {{ item.name }}
        </el-tag>
      </span>
    </div>
    <div v-if="showDir1 || showDir2" class="dir-container">
      <span class="title-item">材质目录</span>
      <span>
        <el-tag
          v-for="(item, index) in datas[selectedDir1].dir2"
          :key="index"
          :effect="item.selected ? 'dark' : 'plain' "
          style="border:none;margin-left: 10px;font-size: 16px; line-height: 33px;"
          class="el-tag-pointer"
          @click="onSelectDir2(index)"
        >
          {{ item.name }}
        </el-tag>
      </span>
    </div>
    <div class="dir-container">
      <el-col :span="6">
        <span>排序</span>
        <el-button-group class="button-group-margin">
          <el-button
            :class="{'active': orderField==='name' }"
            size="mini"
            type="primary"
            plain
            @click="onOrder('name', true)"
          >名称<i class="el-icon-caret-bottom el-icon--right" /></el-button>
          <el-button
            :class="{'active': orderField==='avg_color' }"
            size="mini"
            type="primary"
            plain
            @click="onOrder('avg_color', false)"
          >颜色<i class="el-icon-caret-bottom el-icon--right" /></el-button>
        </el-button-group>
      </el-col>
      <el-col :span="6">
        <brand-select @selectBrand="selectBrand" />
      </el-col>
    </div>
    <div class="list-border">
      <div class="list-container">
        <div v-for="(o,index) in mats.filter(obj=>{return obj.name.toLowerCase().indexOf(matFilter.toLowerCase())>=0})" :key="index" class="list-item">
          <el-card :class="index===selectedMat ? 'el-card-selected' : ''" @click.native="onSelectMat(index)" @dblclick.native="onDblClick(index)">
            <div style="text-align: center; margin:0 auto;position: relative;">
              <el-image :src="getPicUrl(o.pic_file_name)" style="width: 100%; height: 175px;" :title="matInfo(o)" :lazy="true" />
              <span align="center">{{ o.name }}</span>
            </div>
          </el-card>
        </div>
      </div>
    </div>
    <div class="footer">
      <el-col :span="4">
        <el-input v-model="matFilter" clearable placeholder="查找" />
      </el-col>
      <el-col :span="18" align="right">
        <el-button type="primary" @click="onCancel">取消</el-button>
        <el-button type="primary" @click="onSelect">确定</el-button>
      </el-col>
    </div>
  </div>
</template>

<script>
/**
 * @property {Function} fetchCatalog 获取材料目录的回调函数
 * @property {Function} fetchMaterial 获取材料列表的回调函数
 * @property {Boolean} refresh 变为true时刷新数据
 * @property {String} initSelected 初始选中的目录或材料，格式为: 目录1\目录2\材料，后面项可为空
 * @function close 取消选择
 * @function select 选择材料
 */

import { getThumbnailUrl } from '@/utils/pic'
import BrandSelect from '@/components/BrandSelect'
import { mapGetters } from 'vuex'

const noop = () => { }

export default {
  name: 'SingleMaterialSelect',
  components: { BrandSelect },
  props: {
    fetchCatalog: {
      require: true,
      type: Function,
      default: noop
    },
    fetchMaterial: {
      require: true,
      type: Function,
      default: noop
    },
    refresh: {
      require: false,
      type: Boolean,
      default: false
    },
    initSelected: {
      require: false,
      type: String,
      default: ''
    }
  },
  data() {
    return {
      datas: [{ name: '', selected: false, dir2: [] }],
      selectedDir1: -1,
      loadingMat: false,
      mats: [],
      matFilter: '',
      selectedMat: -1,
      orderField: 'name',
      brand: ''
    }
  },
  computed: {
    ...mapGetters([
      'brands'
    ]),
    showDir1: {
      get() {
        return this.selectedDir1 >= 0
        // return this.datas.length > 1
      }
    },
    showDir2: {
      get() {
        return this.selectedDir1 >= 0
        // return this.selectedDir1 >= 0 && this.datas[this.selectedDir1].dir2.length > 1
      }
    },
    matInfo: function() {
      return function(mat) {
        if (mat.u && mat.v) {
          return `${mat.u}x${mat.v}`
        } else {
          return ''
        }
      }
    }
  },
  watch: {
    refresh(val) {
      if (val) {
        this.fetchData()
      }
    }
  },
  mounted() {
    this.brand = this.brands[0].key
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.datas = []
      this.mats = []
      this.selectedDir1 = -1
      this.selectedMat = -1

      const { data } = await this.fetchCatalog(this.brand)
      const dataret = data || {}
      for (const dir in dataret) {
        const newDir = { name: dir, selected: false, dir2: [] }
        dataret[dir].forEach(dir_ => {
          newDir.dir2.push({ name: dir_, selected: false })
        })
        this.datas.push(newDir)
      }

      if (this.datas.length > 0) {
        const strs = this.initSelected.split('\\')
        let idx = this.datas.findIndex(el => el.name === strs[0])
        if (idx >= 0) {
          const dir2 = this.datas[idx].dir2.find(el => el.name === strs[1])
          if (dir2) {
            dir2.selected = true
          }
        } else {
          idx = 0
        }
        this.onSelectDir1(idx)
      }
    },
    onSelectDir1(index) {
      this.datas.forEach((element, i) => {
        element.selected = index === i
      })
      this.selectedDir1 = index
      let index2 = this.datas[index].dir2.findIndex(element => element.selected)
      if (index2 === -1) {
        index2 = 0
      }
      this.onSelectDir2(index2)
    },
    onSelectDir2(index) {
      this.datas[this.selectedDir1].dir2.forEach((element, i) => {
        element.selected = index === i
      })
      this.fetchMaterial2()
    },
    async fetchMaterial2() {
      if (this.selectedDir1 < 0) {
        return
      }
      this.loadingMat = true
      const dir1 = this.datas[this.selectedDir1]
      const dir2 = dir1.dir2.find(element => element.selected)
      const { data } = await this.fetchMaterial(this.brand, dir1.name, dir2.name)
      this.mats = data

      const strs = this.initSelected.split('\\')
      if (dir1.name === strs[0] && dir2.name === strs[1]) {
        this.selectedMat = this.mats.findIndex(el => el.name === strs[2])
      }

      this.loadingMat = false
    },
    getPicUrl(url) {
      return getThumbnailUrl(url)
    },
    onSelectMat(index) {
      this.selectedMat = index
    },
    onDblClick(index) {
      this.selectedMat = index
      this.onSelect()
    },
    onCancel() {
      // window.CloseDialog()
      // this.$emit('update:visible', false)
      this.$emit('close')
    },
    onSelect() {
      if (this.selectedMat > -1 && this.mats.length > this.selectedMat) {
        this.$emit('select', this.mats[this.selectedMat])
      }
    },
    onOrder(field, asc) {
      this.orderField = field
      this.mats.sort((obj1, obj2) => {
        const val1 = obj1[field]
        const val2 = obj2[field]
        if (val1 < val2) {
          return asc ? -1 : 1
        } else if (val1 > val2) {
          return asc ? 1 : -1
        } else {
          return 0
        }
      })
    },
    onDefaultOrder() {

    },
    selectBrand(brand) {
      this.brand = brand
      this.fetchData()
    }
  }
}
</script>

<style scoped>
.el-tag-pointer{
  cursor: pointer;
}
.el-card {
  width: 200px;
  height: 220px;
  margin: 5px;
  border-radius: 5px;
  /* box-sizing: border-box; */
  border: none;
  transition: all .2s;
}

.el-card:hover{
  width: 206px;
  margin: 2px;
}

.el-card-selected {
  width: 200px;
  height: 220px;
  margin: 5px;
  border-radius: 5px;
  /* box-sizing: border-box; */
  /* border: none; */
  background: rgb(214, 214, 214)
}

/* .el-card.is-always-shadow {
  -webkit-box-shadow: none;
  box-shadow: none;
} */

/* .el-card.is-always-shadow:hover {
    -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
} */

.el-card >>> .el-card__body {
  padding: 15px;
}

.dir-container {
  margin: 10px;
}

.title-item{
  display: inline-block;
  width: 75px;
}

.button-group-margin{
  margin-left: 10px;
}

.list-border {
  position:absolute;
  top: 220px;
  bottom: 80px;
  width: calc(100% - 40px);
  overflow: auto;
}

.list-item{
  display: inline-block;
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

