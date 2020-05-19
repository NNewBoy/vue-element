<template>
  <div class="app-container">
    <div class="dir-container">
      <MultiFilter
        :datas="catalogs"
        :filter-names="['门板系列','门板价格']"
        :multi-choices="[false,false]"
        @getResult="getResult"
      />
      <div class="type-filter-name">
        门板造型
      </div>
      <div class="type-filter-container">
        <div align="left" class="scroll-body">
          <Carousel
            :data="carouselData"
            :height="150"
            :autoplay="false"
            indicator-position="outside"
            arrow="always"
            @returnSelection="returnSelection"
          />
        </div>
      </div>
      <div v-loading="listLoading" class="list-border">
        <div class="list-container">
          <div v-for="(o,index) in doorStyleFilter" :key="index" class="list-item">
            <el-card :class="index===selected ? 'el-card-selected' : ''" @click.native="onClick(index)" @dblclick.native="onDblClick(index)">
              <div style="text-align: center; margin:0 auto;position: relative;">
                <el-image :src="getPicUrl(o.preview_pic)" style="width: 100%; height: 100%;" :lazy="true" />
                <span align="center">{{ o.door_color }}</span>
              </div>
            </el-card>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <el-col :span="4">
        <el-input v-model="search" clearable placeholder="查找" />
      </el-col>
      <el-col :span="6">
        <brand-select @selectBrand="selectBrand" />
      </el-col>
      <el-col :span="12" align="right">
        <el-button type="primary" @click="onCancel">取消</el-button>
        <el-button type="primary" @click="onSelect">确定</el-button>
      </el-col>
    </div>
  </div>
</template>

<script>
import { getCatalog, getColorList, getDoorShapePic, getCatalogByScheme, getColorListByScheme } from '@/api/doorstyle'
import MultiFilter from '@/components/MultiFilter'
import { getThumbnailUrl } from '@/utils/pic'
import toPinyin from '@/utils/chineseToPinyin'
import BrandSelect from '@/components/BrandSelect'
import Carousel from '@/components/Carousel'

export default {
  components: { MultiFilter, BrandSelect, Carousel },
  data() {
    return {
      listLoading: false,
      catalogs: [], // 门板目录
      selectDir: [], // 选中的门板目录
      doorstyleList: [], // 门板列表
      doorShapeList: [],
      search: '',
      selected: -1,
      doorShapePicList: [],
      doorShapePicListCache: [], // doorshape示意图
      doorShape: '', // 当前选中的门板造型
      doorStyleSchemeId: [''],
      brand: '',
      carouselData: [] // 轮播翻页组件数据
    }
  },
  computed: {
    doorStyle() {
      return [this.selectDir[0].name, this.selectDir[1].name, this.doorShape].join('\\') + '\\\\\\'
      // return this.selectDir.map(item => item.name).join('\\') + '\\\\\\' // ext4/5/6
    },
    doorStyleFilter: function() {
      return this.doorstyleList.filter(el => {
        const txt = el.door_color
        const st = this.search.toUpperCase()
        return txt.toUpperCase().indexOf(st) >= 0 ||
          toPinyin.getFirstLetter(txt).indexOf(st) >= 0 ||
          toPinyin.chineseToPinYin(txt).toUpperCase().indexOf(st) >= 0
      })
    }
  },
  watch: {
    doorShape(val) {
      this.fetchDoorColor()
    }
  },
  created() {
    const schemeId = this.$route.query.scheme
    if (schemeId) {
      this.doorStyleSchemeId.push(schemeId)
    }
    const brand = this.$route.query.brand
    this.brand = brand
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const { data } = await (this.doorStyleSchemeId.length > 0 ? getCatalogByScheme(this.doorStyleSchemeId) : getCatalog())
      const calCatalog = (function() {
        return function fun(dirs) {
          const catalogs = []
          for (const dir in dirs) {
            let next = []
            if (Array.isArray(dirs[dir])) {
              dirs[dir].forEach(element => {
                next.push({ name: element })
              })
            } else {
              next = fun(dirs[dir])
            }

            catalogs.push({ name: dir, children: next })
          }
          return catalogs
        }
      })()

      this.catalogs = calCatalog(data)
    },
    onCancel() {

    },
    onSelect() {
      // console.log('select: ', this.doorstyleList[this.selected])
      // if (this.selected > -1 && this.doorstyleList.length > this.selected) {
      //   const ds = this.doorstyleList[this.selected]
      //   const st = JSON.stringify(ds)
      //   window.SelectDoorStyle(st)
      // }
    },
    getResult(arr) {
      if (arr.length > 0) {
        this.selectDir = arr[0]

        this.doorShapeList = this.catalogs[this.selectDir[0].index].children[this.selectDir[1].index].children
        this.doorShape = this.doorShapeList[0].name
        const str = this.selectDir[0].name + '\\' + this.selectDir[1].name
        if (Object.keys(this.doorShapePicListCache).indexOf(str) >= 0) {
          this.doorShapePicList = this.doorShapePicListCache[str]
        } else {
          getDoorShapePic(this.selectDir[0].name, this.selectDir[1].name).then((res) => {
            this.doorShapePicList = []
            res.data.forEach(el => {
              this.doorShapePicList[el.door_shape] = el.preview_pic
            })
            this.doorShapePicListCache[str] = this.doorShapePicList
            // console.log(this.doorShapePicList)
          })
        }

        this.carouselData = []
        for (const item of this.doorShapeList) {
          const temp = {}
          temp.text = item.name
          temp.src = this.getDoorShapePicUrl(this.doorShapePicList[item.name])
          this.carouselData.push(temp)
        }
      }
      // else {
      //   this.doorstyleList = []
      // }
    },
    returnSelection(doorShape) {
      this.doorShape = doorShape
      // this.fetchDoorColor()
    },
    async getDoorShapePic() {
      const doorshape = []
      this.doorstyleList.forEach(el => doorshape.push(el.name))
    },
    async fetchDoorColor() {
      this.listLoading = true
      const { data } = await (this.doorStyleSchemeId.length > 0 ? getColorListByScheme(this.doorStyleSchemeId, this.doorStyle, this.brand) : getColorList(this.doorStyle))
      this.doorstyleList = data
      this.listLoading = false
    },
    onClick(index) {
      this.selected = index
    },
    onDblClick(index) {
      this.selected = index
      this.onSelect()
    },
    getPicUrl(pic) {
      return getThumbnailUrl(pic)
    },
    getDoorShapePicUrl(doorshape) {
      if (!doorshape) {
        return ''
      }
      return this.getPicUrl('kitdat/door/' + doorshape)
    },
    selectBrand(brand) {
      this.brand = brand
    }
  }
}
</script>

<style scoped>
.select-tag{
  background-color: #5153d4 !important;
  color: white !important;
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

.el-card >>> .el-card__body {
  padding: 15px;
}

.dir-container {
  position:absolute;
  top: 0px;
  bottom: 80px;
  margin: 10px;
  overflow: auto;
}

.list-border {
  width: calc(100% - 40px);
}

.list-item{
  display: inline-block;
}

.list-doorshape {
  width: 110px;
  height: 150px;
  top: 0px;
  text-align: center;
  vertical-align: top;
  margin: 2px;
  position: relative;
  display: inline-block;
}

.selected-doorshape {
  width: 110px;
  height: 150px;
  top: 0px;
  text-align: center;
  vertical-align: top;
  margin: 2px;
  position: relative;
  display: inline-block;
  border-radius: 4px;
  border: 1px solid;
  border-color: #e4393c;
  color: #e4393c;
}

.footer {
  position: absolute;
  bottom: 0px;
  margin: 0px;
  width: 100%;
  height: 60px;
  display: block;
}
.type-filter-container{
  position: relative;
  overflow: hidden;
  padding-left: 10px;
  padding-right: 10px;
  margin-left: 110px;
}
.type-filter-name{
  float: left;
  padding-left: 10px;
  padding-top: 16px;
  max-width: 110px;
}
.scroll-body{
  overflow:auto;
  margin: 6px 0;
  border-radius: 4px;
  border: 1px solid #DDD;
}
</style>

