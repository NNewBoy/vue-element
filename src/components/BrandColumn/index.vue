<template>
  <div class="app-container">
    <el-table-column v-for="(o, i) in brands" :key="i" align="center" :label="o.name" width="50">
      <template slot-scope="{row}">
        <span class="my-checkbox" :class="row[o.key]===1?'is-checked':''" @click="onClick(row, o)">
          <span class="my-checkbox-inner" />
        </span>
      </template>
    </el-table-column>
    <!-- <el-table-column align="center" label="尚品" width="50">
      <template slot-scope="{row}">
        <span class="my-checkbox" :class="row.spzp===1?'is-checked':''" @click="row.spzp=row.spzp===1?0:1">
          <span class="my-checkbox-inner" />
        </span>
      </template>
    </el-table-column>
    <el-table-column align="center" label="维意" width="50">
      <template slot-scope="{row}">
        <span class="my-checkbox" :class="row.spzp===1?'is-checked':''" @click="row.spzp=row.spzp===1?0:1">
          <span class="my-checkbox-inner" />
        </span>
      </template>
    </el-table-column>
    <el-table-column align="center" label="孖酷" width="50">
      <template slot-scope="{row}">
        <span class="my-checkbox" :class="row.spzp===1?'is-checked':''" @click="row.spzp=row.spzp===1?0:1">
          <span class="my-checkbox-inner" />
        </span>
      </template>
    </el-table-column> -->
  </div>
</template>

<script type="text/javascript">
import { mapGetters } from 'vuex'

export default {
  name: 'BrandColumn',
  props: {

  },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'brands'
    ])
  },
  created() {
  },
  methods: {
    onClick(row, item) {
      row[item.key] = row[item.key] === 1 ? 0 : 1
      row.editStatus = 1
    }
  }
}
</script>

<style lang="scss" scoped>
.my-checkbox{
  white-space: nowrap;
  cursor: pointer;
  outline: none;
  display: inline-block;
  line-height: 1;
  position: relative;
  vertical-align: middle;

  &.is-checked{
    .my-checkbox-inner{
      background-color: #1890ff;
      border-color: #1890ff;
    }
  }

  .my-checkbox-inner{
    display: inline-block;
    position: relative;
    border: 1px solid #DCDFE6;
    border-radius: 2px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 14px;
    height: 14px;
    background-color: #fff;
    z-index: 1;
    transition: border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46),background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);

    &:after{
      height: 6px;
      width: 2px;
      box-sizing: content-box;
      content: "";
      border: 1px solid #fff;
      border-left: 0;
      border-top: 0;
      left: 4px;
      position: absolute;
      top: 1px;
      transform: rotate(45deg) scaleY(1);
      transition: transform .15s ease-in .05s, -webkit-transform .15s ease-in .05s;
      transform-origin: center;
    }
  }
}
</style>
