<template>
  <div>
    <div>{{ data[0] }}</div>
    <router-view />
  </div>
</template>

<script type="text/javascript">
import Vue from 'vue'
import { getFirst } from '@/api/test'
export default {
  name: 'ExportOne',
  data() {
    return {
      data: []
    }
  },
  computed: {},
  created() {
    getFirst(1).then(response => {
      console.log(response)
      Vue.set(this.data, 0, response.data.data[0])
    }).catch(err => {
      console.log(`err:${err}`)
    })
  },
  mounted() {},
  methods: {}
}
</script>

<style></style>
