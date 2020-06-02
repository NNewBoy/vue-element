<template>
  <div v-show="visibleMenu" ref="contextmenu" :style="{left:menuLeft+'px',top:menuTop+'px'}" class="contextmenu">
    <div v-for="(item, index) in items" :key="index" class="contextmenu-item" @click="onClickItem(item)">{{ item.name }}</div>
  </div>
</template>

<script>
export default {
  name: 'ContextMenu',
  props: {
    items: {
      required: true,
      type: Array,
      default() {
        return []
      }
    },
    click: {
      required: false,
      type: Function,
      default: null
    }
  },
  data() {
    return {
      visibleMenu: false,
      menuLeft: 0,
      menuTop: 0,
      data: null
    }
  },
  watch: {
    visibleMenu(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  methods: {
    show(event, data) {
      this.data = data
      // 设置菜单出现的位置
      const menuMinWidth = 100
      // const menuMinHeight = 100

      const el = this.$parent.$el
      const rect = el.getBoundingClientRect()
      const offsetLeft = rect.left
      const offsetTop = rect.top

      const maxLeft = el.offsetWidth - menuMinWidth
      // const maxTop = el.offsetHeight - menuMinHeight

      const left = event.clientX - offsetLeft // 15: margin right
      this.menuLeft = Math.min(left, maxLeft)

      const top = event.clientY - offsetTop
      // this.menuTop = Math.min(top, maxTop)
      this.menuTop = top

      this.visibleMenu = true
    },
    closeMenu() {
      this.visibleMenu = false
    },
    onClickItem(item) {
      this.$emit('click', this.data, item)
    }
  }
}
</script>

<style scoped>
.contextmenu {
  height: auto;
  width: auto;
  position: absolute;
  background: #f1f1f1;
  border-radius: 5px;
  display: inline-block;
  padding: 5px;
  z-index: 999999;
}

.contextmenu-item {
  border-radius: 3px;
  padding: 5px;
}
.contextmenu-item:hover {
  background: #d8d8d8;
  border: 1px solid #000000
}
</style>
