<template>
  <div>
    <div @click="onClick">
      <el-image :src="getPicUrl(data)" class="pic" :lazy="true" :title="picTitle" />
      <span>{{ data ? data.name : "未选择" }}</span>
    </div>
    <el-dialog title="选择材料" :visible.sync="dialogFormVisible" width="90%" height="90%" style="z-index:999999" :center="false">
      <material-select :init-dir1="dir1" :init-dir2="dir2" :init-name="matName" @cancel="dialogFormVisible=false" @selectMat="onSelectMat" />
    </el-dialog>
  </div>
</template>

<script type="text/javascript">

import MaterialSelect from '@/components/MaterialSelect'
import { getThumbnailUrl } from '@/utils/pic'

export default {
  name: 'ShowMaterial',
  components: { MaterialSelect },
  props: {
    data: {
      require: true,
      type: Object,
      default() {
        return {
          id: null,
          use_group: '',
          texture_group: '',
          pic_file_name: '',
          name: ''
        }
      }
    },
    onSelect: {
      require: false,
      type: Function,
      default: null
    }
  },
  data() {
    return {
      dialogFormVisible: false
    }
  },
  computed: {
    picTitle() {
      return this.data ? this.data.use_group + '\\' + this.data.texture_group : ''
    },
    dir1() {
      return this.data ? this.data.use_group : ''
    },
    dir2() {
      return this.data ? this.data.texture_group : ''
    },
    matName() {
      return this.data ? this.data.name : ''
    }
  },
  methods: {
    getPicUrl(data) {
      return data ? getThumbnailUrl(data.pic_file_name) : ''
    },
    onClick() {
      this.dialogFormVisible = true
    },
    onSelectMat(datas) {
      this.dialogFormVisible = false
      if (datas.length > 0) {
        // Object.assign(this.data, datas[0])
        // this.$emit('select', datas[0])
        // console.log('asdf')
        this.onSelect && this.onSelect(datas[0])
      }
    }
  }
}
</script>

<style scoped>
.pic {
  width: 80px;
  height: 80px;
  display: block;
}
</style>
