<template>
  <div class="container">
    <el-collapse-transition>
      <div v-show="show">
        <slot />
      </div>
    </el-collapse-transition>
    <div class="button-border" @click="onClick">
      <i :class="show?'el-icon-arrow-up':'el-icon-arrow-down'" />
      <span>{{ show?'收起':'展开' }}</span>
    </div>
  </div>
</template>

<script type="text/javascript">
/**
 * @property {Boolean} initShow 初始化时是否展开
 * @function onShow 点击按钮事件，返回boolean，true为展开，false为收起
 */
export default {
  name: 'Collapse',
  props: {
    initShow: {
      require: false,
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      show: true
    }
  },
  watch: {
    initShow: {
      immediate: true,
      handler(val) {
        this.show = val
      }
    }
  },
  methods: {
    onClick() {
      this.show = !this.show
      this.$nextTick(() => {
        this.$emit('onShow', this.show)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  border: 1px solid #ebebeb;
  border-radius: 3px;
  transition: all 0.3s ease;

  &:hover{
    box-shadow: 0 0 8px 0 rgba(232,237,250,0.6),0 2px 4px 0 rgba(232,237,250,0.5);
  }
}
.button-border{
  text-align: center;
  border-top: 1px solid #eaeefb;
  height: 40px;
  background-color: #fff;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  color: #d3dce6;
  line-height: 40px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover{
    background-color: #fafafa;
    color: #409eff;
  }

  span{
    margin-left: 10px;
  }
}

</style>
