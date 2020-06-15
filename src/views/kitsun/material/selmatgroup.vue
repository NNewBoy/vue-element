<template>
  <div class="app-container">
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
          <el-card :class="index===selectedMat ? 'el-card-selected' : ''" @click.native="onSelectMat(index)">
            <div style="text-align: center; margin:0 auto;position: relative;">
              <el-image :src="getPicUrl(o.pic_file_name)" style="width: 100%; height: 100%;" :title="matInfo(o)" />
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
        <el-button type="primary" :disabled="selectedMat===-1" @click="onSelect">确定</el-button>
      </el-col>
    </div>
  </div>
</template>

<script>
import { getCatalogByObjName, getCatalogByProductPros, getCatalogByLineType, getMatByConstraints } from '@/api/material'
import { getThumbnailUrl } from '@/utils/pic'
import BrandSelect from '@/components/BrandSelect'

export default {
  components: { BrandSelect },
  data() {
    return {
      datas: [{ name: '', selected: false, dir2: [] }],
      selectedDir1: -1,
      loadingMat: false,
      mats: [],
      matFilter: '',
      matConstrain: [],
      selectedMat: -1,
      orderField: 'name'
    }
  },
  computed: {
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
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.$route.params.type = '1' // 模拟
      this.$route.params.params = '1,2' // 模拟

      this.datas = []
      this.selectedDir1 = -1
      this.selectedMat = -1
      const paramType = this.$route.params.type
      const params = this.$route.params.params
      let dataret = []
      if (paramType === '1') {
        // objname
        const objProps = params.split(',')
        const { data } = await getCatalogByObjName(...objProps)
        dataret = data
      } else if (paramType === '2') {
        // product dir
        const brand = params.substring(0, params.indexOf(','))
        const products = params.substring(brand.length + 1).split('^')
        const pros = JSON.stringify(products)
        const { data } = await getCatalogByProductPros(brand, pros)
        dataret = data
      } else if (paramType === '3') {
        // line style
        const lineProps = params.split(',')
        const { data } = await getCatalogByLineType(...lineProps)
        dataret = data
      }
      dataret.forEach(element => {
        let dir1 = this.datas.find(el => el.name === element.mat_dir1)
        if (!dir1) {
          this.datas.push({ name: element.mat_dir1, selected: false, dir2: [] })
          dir1 = this.datas[this.datas.length - 1]
        }
        const dir2 = dir1.dir2.find(el => el.name === element.mat_dir2)
        if (!dir2) {
          dir1.dir2.push({ name: element.mat_dir2, selected: false })
        }
      })

      if (this.datas.length > 0) {
        this.onSelectDir1(0)
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
      this.matConstrain = this.datas[this.selectedDir1].dir2[index].items
      this.fetchMaterial()
    },
    fetchMaterial() {
      if (this.selectedDir1 < 0) {
        return
      }
      this.loadingMat = true
      const dir1 = this.datas[this.selectedDir1]
      const dir2 = dir1.dir2.find(element => element.selected)
      const paramType = this.$route.params.type
      const constraints = this.$route.params.params
      getMatByConstraints(dir1.name, dir2.name, paramType, constraints).then((res) => {
        this.mats = res.data
        this.loadingMat = false
      }).catch(() => {
        this.loadingMat = false
      })
    },
    getPicUrl(url) {
      return getThumbnailUrl(url)
    },
    onSearch() {

    },
    onSelectMat(index) {
      this.selectedMat = index
    },
    onDblClick(index) {
      this.selectedMat = index
      this.onSelect()
    },
    onCancel() {
      window.CloseDialog()
    },
    onSelect() {
      if (this.selectedMat > -1 && this.mats.length > this.selectedMat) {
        const mat = this.mats[this.selectedMat]
        const st = JSON.stringify(mat)
        window.SelectMaterial(st)
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
      const params = this.$route.params.params.split(',')
      params[0] = brand
      this.$route.params.params = params.join(',')
      this.fetchMaterial()
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
  top: 150px;
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

