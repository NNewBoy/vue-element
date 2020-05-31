<template>
  <div v-if="roles.findIndex(el=>el==='pm')>=0">
    <el-form>
      <el-col :span="4">
        <el-input v-model="testbrand" class="input-one" placeholder="品牌" />
      </el-col>
      <el-col :span="4">
        <el-input v-model="initdoor" class="input-one" placeholder="初始门板" />
      </el-col>
      <el-col :span="6">
        <el-input v-model="widths" class="input-one" placeholder="宽" width="60" />
      </el-col>
      <el-col :span="7">
        <el-input v-model="heights" class="input-one" placeholder="高" />
      </el-col>
      <el-col :span="3">
        <el-button type="primary" @click="ontest">cef测试</el-button>
      </el-col>
    </el-form>
  </div>
</template>

<script type="text/javascript">
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      testbrand: 'spzp',
      initdoor: 'd1/d2/d3/d4/d5/d6/d7',
      widths: '[\'100\',\'300\',\'300\']',
      heights: '[\'100\',\'300\',\'300\']'
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
    ontest() {
      const jsonObj = { 'brand': this.testbrand, 'initdoor': this.initdoor, 'widths': this.widths, 'heights': this.heights }
      const str = JSON.stringify(jsonObj)
      this.$store.dispatch('cefdatas/setSelectDoorParams', str)
      this.$emit('cefTest')
    }
  }
}
</script>
