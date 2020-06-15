<template>
  <div class="app-container">
    <div class="dir-container">
      <MemoryFilter
        :datas="catalogs"
        :filter-names="['门板系列','门板价格']"
        :multi-choices="[false,false]"
        @getResult="getResult"
      />
      <CarouselFilter
        filter-name="门板造型"
        :carousel-data="carouselData"
        :height="150"
        :autoplay="false"
        :selected="doorShape"
        indicator-position="outside"
        arrow="always"
        @returnSelection="returnSelection"
      />
      <div v-loading="listLoading" class="list-border">
        <div class="list-container">
          <div v-for="(o,index) in doorStyleFilter" :key="index" class="list-item">
            <el-card :class="index===selected ? 'el-card-selected' : ''" @click.native="onClick(index)" @dblclick.native="onDblClick(index)" @contextmenu.prevent.native="openMenu($event)">
              <div style="text-align: center; margin:0 auto;position: relative;">
                <div>
                  <el-image :src="getDoorPreview(o.preview_pic)" style="width: 100%; height: 170px;" />
                  <div v-if="o.door_inner" class="door-inner-container">
                    <div v-for="(inner, iInner) in o.door_inner" :key="iInner">
                      <el-image
                        :src="getPicUrl(inner.default_material.pic_file_name)"
                        class="door-inner-img"
                        @mouseover="hoverDoorInner=inner"
                        @mouseleave="hoverDoorInner=null"
                        @click="onSelectDoorInner(inner)"
                      />
                    </div>
                  </div>
                </div>
                <span align="center">{{ o.door_color }}</span>
              </div>
            </el-card>
          </div>
        </div>
      </div>
    </div>
    <div v-show="visibleMenu" :style="{left:menuLeft+'px',top:menuTop+'px'}" class="contextmenu">
      <el-button @click="test">test</el-button>
    </div>
    <el-dialog title="选择门芯材料" :visible.sync="visibleSelectDoorInner" width="90%" height="90%">
      <div class="select-door-inner">
        <single-material-select
          :refresh="visibleSelectDoorInner"
          :fetch-catalog="fetchInnerCatalog"
          :fetch-material="fetchInnerMaterial"
          :init-selected="initSelectedMat"
          @select="selectedDoorInner"
          @close="onCancelDoorInner"
        />
      </div>
    </el-dialog>
    <div class="footer">
      <el-col :span="4">
        <el-input v-model="search" clearable placeholder="查找" />
      </el-col>
      <el-col :span="6">
        <div class="footer-brand">
          <brand-select @selectBrand="selectBrand" />
        </div>
      </el-col>
      <el-col :span="8">
        <door-constraint @cefTest="cefTest" />
      </el-col>
      <el-col :span="4" align="right">
        <el-button type="primary" @click="onCancel">取消</el-button>
        <el-button type="primary" :disabled="selected===-1" @click="onSelect">确定</el-button>
      </el-col>
    </div>
  </div>
</template>

<script>
import { getCatalogByDoorInner, getMatByDoorInner } from '@/api/material'
import { /* getCatalog, getColorList,*/ getDoorShapePic, getCatalogByScheme, getCatalogByProduct, getColorListByScheme, getColorListByProduct } from '@/api/doorstyle'
import MemoryFilter from '@/components/MemoryFilter'
import { getThumbnailUrl } from '@/utils/pic'
import toPinyin from '@/utils/chineseToPinyin'
import BrandSelect from '@/components/BrandSelect'
import CarouselFilter from '@/components/CarouselFilter'
import DoorConstraint from '@/components/TestComponents/DoorConstraint'
import SingleMaterialSelect from '@/components/SingleMaterialSelect'
import { mapGetters } from 'vuex'

export default {
  components: { MemoryFilter, BrandSelect, CarouselFilter, DoorConstraint, SingleMaterialSelect },
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
      doorShapeHistory: {}, // 选中的门板造型历史数据
      doorStyleSchemeId: [],
      brand: '',
      carouselData: [], // 轮播翻页组件数据
      // 右键菜单
      visibleMenu: false,
      menuLeft: 0,
      menuTop: 0,
      hoverDoorInner: null, // 鼠标停留的门芯
      // 选择门芯材料
      visibleSelectDoorInner: false,
      currentDoorInner: null
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
    },
    ...mapGetters([
      'brands',
      'select_door_params'
    ]),
    initSelectedMat() {
      if (this.currentDoorInner && this.currentDoorInner.default_material) {
        return this.currentDoorInner.default_material.use_group + '\\' + this.currentDoorInner.default_material.texture_group + '\\' + this.currentDoorInner.default_material.name
      } else {
        return ''
      }
    }
  },
  watch: {
    doorShape(val) {
      this.fetchDoorColor()
    },
    visibleMenu(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    },
    select_door_params(value) {
      // console.log(value)
      // 约束条件发生变化，刷新页面
      this.fetchData()
    }
  },
  created() {
    const schemeId = this.$route.query.scheme
    if (schemeId) {
      this.doorStyleSchemeId.push(schemeId)
    }
    const brand = this.$route.query.brand
    this.brand = brand || this.brands[0].key

    if (this.doorStyleSchemeId.length > 0) {
      this.fetchData() // 管理页面测试约束方案
    } else {
      //
    }
  },
  mounted() {
    window.VueCreated()
  },
  methods: {
    async fetchData() {
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

      let data = null
      if (this.select_door_params && this.select_door_params.modelnos && this.select_door_params.modelnos[0]) {
        // console.log(this.select_door_params)
        const rlt = await getCatalogByProduct(this.select_door_params)
        data = rlt.data
      } else if (this.doorStyleSchemeId.length > 0) {
        const rlt = await getCatalogByScheme(this.doorStyleSchemeId, this.brand)
        data = rlt.data
      }
      this.catalogs = calCatalog(data)
      // const { data } = await (this.doorStyleSchemeId.length > 0 ? getCatalogByScheme(this.doorStyleSchemeId, this.brand) : getCatalog())

      // this.catalogs = calCatalog(data)
    },
    onCancel() {
      window.CloseDialog()
    },
    onSelect() {
      // console.log('select: ', this.doorstyleList[this.selected])
      if (this.selected > -1 && this.doorstyleList.length > this.selected) {
        const ds = this.doorstyleList[this.selected]
        const st = JSON.stringify(ds)
        console.log(st)
        window.SelectDoor(st)
      }
    },
    cefTest() {
      // debugger
      // console.log(this.select_door_params)
      // const td = JSON.parse(this.select_door_params)
      // console.log(td.brand)
      // console.log(td.initdoor)
      // console.log(td.widths)
      // console.log(td.heights)
    },
    getResult(arr) {
      if (arr.length > 0) {
        this.selectDir = arr[0]

        const getCarouseData = () => {
          this.carouselData = []
          for (const item of this.doorShapeList) {
            this.carouselData.push({ text: item.name, src: this.getDoorShapePicUrl(this.doorShapePicList[item.name]) })
          }
          const index = JSON.stringify([this.selectDir.slice(0, 2)])
          if (!this.doorShapeHistory[index]) {
            this.doorShapeHistory[index] = this.doorShapeList[0].name
          }
          this.doorShape = this.doorShapeHistory[index]
        }

        this.doorShapeList = this.catalogs[this.selectDir[0].index].children[this.selectDir[1].index].children

        const str = this.selectDir[0].name + '\\' + this.selectDir[1].name
        if (Object.keys(this.doorShapePicListCache).indexOf(str) >= 0) {
          this.doorShapePicList = this.doorShapePicListCache[str]
          getCarouseData()
        } else {
          getDoorShapePic(this.selectDir[0].name, this.selectDir[1].name).then((res) => {
            this.doorShapePicList = []
            res.data.forEach(el => {
              this.doorShapePicList[el.door_shape] = el.preview_pic
            })
            this.doorShapePicListCache[str] = this.doorShapePicList
            // console.log(this.doorShapePicList)

            getCarouseData()
          })
        }
      }
      // else {
      //   this.doorstyleList = []
      // }
    },
    returnSelection(doorShape) {
      this.doorShape = doorShape
      this.doorShapeHistory[JSON.stringify([this.selectDir.slice(0, 2)])] = doorShape
      // this.fetchDoorColor()
    },
    async getDoorShapePic() {
      const doorshape = []
      this.doorstyleList.forEach(el => doorshape.push(el.name))
    },
    async fetchDoorColor() {
      this.listLoading = true

      let data = null
      if (this.select_door_params && this.select_door_params.modelnos && this.select_door_params.modelnos[0]) {
        const rlt = await getColorListByProduct(this.select_door_params, this.doorStyle)
        data = rlt.data
      } else if (this.doorStyleSchemeId.length > 0) {
        const rlt = await getColorListByScheme(this.doorStyleSchemeId, this.doorStyle, this.brand)
        data = rlt.data
      }

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
    getDoorPreview(pic) {
      if (this.hoverDoorInner && this.hoverDoorInner.inner_zone_pic) {
        return getThumbnailUrl('kitdat/doorinner/' + this.hoverDoorInner.inner_zone_pic)
      }
      return getThumbnailUrl(pic)
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
      this.fetchData() // 目录都有可能不一样，要重新获取
      this.fetchDoorColor()
    },
    openMenu(event) {
      // console.log(event)
      const menuMinWidth = 105
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      const offsetWidth = this.$el.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = event.clientX - offsetLeft // 15: margin right

      if (left > maxLeft) {
        this.menuTop = maxLeft
      } else {
        this.menuLeft = left
      }

      this.menuTop = event.clientY - 60 // fix 位置bug
      this.visibleMenu = true
    },
    closeMenu() {
      this.visibleMenu = false
    },
    test() {
      console.log('adfsf')
    },
    onSelectDoorInner(inner) {
      this.currentDoorInner = inner
      this.visibleSelectDoorInner = true
    },
    onCancelDoorInner() {
      this.currentDoorInner = null
      this.visibleSelectDoorInner = false
    },
    selectedDoorInner(mat) {
      this.currentDoorInner.default_material = mat
      this.onCancelDoorInner()
    },
    async fetchInnerCatalog(brand) {
      return await getCatalogByDoorInner(brand, this.currentDoorInner.id)
    },
    async fetchInnerMaterial(brand, dir1, dir2) {
      return await getMatByDoorInner(brand, this.currentDoorInner.id, dir1, dir2)
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
.footer-brand{
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.contextmenu {
  width: 150px;
  position: absolute;
  background: #ffffff;
  border-radius: 5px;
  display: inline-block;
}

.door-inner-container {
  position: absolute;
  display: flex;
  justify-content: flex-end;
  bottom: 15px;
  width: 100%;
  height: 50px;
}

.door-inner-img {
  width: 40px;
  height: 40px;
  margin: 2px;
  border: 1px solid;
  border-color:rgb(243, 120, 120);
  border-radius: 4px;
}

.select-door-inner {
  display: block;
  width: 80%;
  height: 600px;
  background-color: #ffffff;
}
</style>

