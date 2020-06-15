import Vue from 'vue'
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'
import VXETablePluginElement from 'vxe-table-plugin-element'
import 'vxe-table-plugin-element/dist/style.css'
// import VXETablePluginAntd from 'vxe-table-plugin-antd'
// import 'vxe-table-plugin-antd/dist/style.css'
// import VXETablePluginIView from 'vxe-table-plugin-iview'
// import 'vxe-table-plugin-iview/dist/style.css'

Vue.use(VXETable)
VXETable.use(VXETablePluginElement)
// VXETable.use(VXETablePluginAntd)
// VXETable.use(VXETablePluginIView)

// 给 vue 实例挂载全局窗口对象
// Vue.prototype.$XModal = VXETable.modal

VXETable.setup({
  table: {
    border: true,
    showHeader: true,
    showHeaderOverflow: true,
    showOverflow: true,
    resizable: true,
    align: 'center',
    editConfig: {
      trigger: 'dblclick',
      mode: 'cell',
      showStatus: true
    },
    checkboxConfig: {
      range: true
    }
    // mouseConfig: {
    //   selected: true
    // },
    // keyboardConfig: {
    //   isArrow: true,
    //   isDel: true,
    //   isEnter: true,
    //   isTab: true,
    //   isEdit: true
    // }
  },
  pager: {
    autoHidden: false,
    perfect: false,
    pageSize: 20,
    pageSizes: [20, 50, 100, 200, 500],
    // layouts: ['PrevJump', 'PrevPage', 'Jump', 'PageCount', 'NextPage', 'NextJump', 'Sizes', 'Total']
    layouts: ['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']
  }
})

// 创建渲染
VXETable.renderer.mixin({
  'trueFalseCellSwitch': {
    // 默认显示模板
    renderDefault(h, renderOpts, params) {
      const { row, column } = params
      return [
        <el-switch v-model={row[column.property]} active-value={1} inactive-value={0} />
      ]
    }
  },
  'trueFalseEditSwitch': {
    // 激活时自动聚焦
    autofocus: '.my-cell',
    // 可编辑激活模板
    renderEdit(h, renderOpts, { row, column }) {
      return [
        <el-switch class='my-cell' v-model={row[column.property]} active-value={1} inactive-value={0} />
      ]
    },
    // 可编辑显示模板
    renderCell(h, renderOpts, { row, column }) {
      return [
        <el-switch v-model={row[column.property]} active-value={1} inactive-value={0} />
      ]
    }
  },
  'myButton': {
    autofocus: '.my-cell',
    renderEdit(h, renderOpts, params) {
      const { row, column } = params
      const { events } = renderOpts
      const { props } = renderOpts
      const res = props.find((val) => val.key === row[column.property])
      return [
        <vxe-button class='my-cell' onClick={() => events.click(params)}>{ res.name }</vxe-button>
      ]
    },
    // 编辑显示模板 props: [{name,key}]
    renderCell(h, renderOpts, { row, column }) {
      const { props } = renderOpts
      const res = props.find((val) => val.key === row[column.property])
      return [
        <span>{ res.name }</span>
      ]
    }
  },
  'showStatus': { // 仅可显示修改状态，不可修改
    autofocus: '.my-cell',
    renderEdit(h, renderOpts, { row, column }) {
      return [
        <vxe-input class='my-cell' v-model={row[column.property]} readonly></vxe-input>
      ]
    },
    renderCell(h, renderOpts, { row, column }) {
      return [
        <span>{ row[column.property] }</span>
      ]
    }
  },
  'NumberInput': { // 数字输入框
    autofocus: '.my-cell',
    renderEdit(h, renderOpts, { row, column }) {
      return [
        <vxe-input type='number' class='my-cell' text='text' v-model={row[column.property] }></vxe-input>
      ]
    },
    renderCell(h, renderOpts, { row, column }) {
      return [
        <span>{ row[column.property] }</span>
      ]
    }
  }
})
