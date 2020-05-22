<template>
  <div v-if="roles.findIndex(el=>el==='pm')>=0">
    品牌
    <el-radio-group v-model="brand" size="mini" style="margin-left:10px" @change="onSelect">
      <el-radio-button v-for="(item,index) in brands" :key="index" :label="item.name" />
    </el-radio-group>
  </div>
</template>

<script type="text/javascript">
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      brand: ''
    }
  },
  computed: {
    ...mapGetters([
      'brands',
      'roles'
    ])
  },
  mounted() {
    this.brand = this.brands[0].name
  },
  methods: {
    onSelect() {
      this.$emit('selectBrand', this.brands.find(el => el.name === this.brand).key)
    }
  }
}
</script>
