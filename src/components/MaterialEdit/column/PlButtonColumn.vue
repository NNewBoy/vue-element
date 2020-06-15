<template>
  <div class="app-container">
    <PlTableColumn show-overflow-tooltip :label="label" :width="width" :min-width="minWidth" align="center">
      <template slot-scope="{row}">
        <!-- <el-button class="myColumn-button" @click="onClick(row)">
          <span class="button-inner">{{ getText(row[value]) }}</span>
          <i class="el-icon-caret-bottom" />
        </el-button> -->
        <div class="myColumn-button" @click="onClick(row)">
          <input type="text" autocomplete="off" placeholder="请选择" :value="getText(row[value])" class="el-input__inner" readonly="readonly">
          <span class="el-input__suffix">
            <span class="el-input__suffix-inner">
              <i class="el-select__caret el-input__icon el-icon-arrow-down" />
            </span>
          </span>
        </div>

        <span class="button-span">{{ getText(row[value]) }}</span>
      </template>
    </PlTableColumn>
  </div>
</template>

<script type="text/javascript">
/**
 * 使用该column组件的el-table需加上类名tb-edit
 * @property {Array} dataList 选项数据，格式[{ value: 0, text: 'xx' }]
 * @property {String} label 列名
 * @property {String} width 列宽
 * @property {String} minWidth 最小列宽
 * @property {String} value 列绑定的字段名
 * @function onSelect 点击按钮时返回该row
 */
import { PlTableColumn } from 'pl-table'
export default {
  name: 'ButtonColumn',
  components: { PlTableColumn },
  props: {
    dataList: {
      required: true,
      type: Array,
      default() {
        return []
      }
    },
    label: {
      require: true,
      type: String,
      default: ''
    },
    width: {
      require: false,
      type: String,
      default: ''
    },
    minWidth: {
      require: false,
      type: String,
      default: ''
    },
    value: {
      require: true,
      type: String,
      default: ''
    }
  },
  methods: {
    onClick(row) {
      this.$emit('onSelect', row)
    },
    getText(data) {
      const res = this.dataList.find((val) => val.value === data)
      return res ? res.text : ''
    }
  }
}
</script>

<style lang="scss">
.button-inner{
  display: inline-block;
  width: 100%;
}
.tb-edit .myColumn-button {
  display: none;
  width:100%;
}
.tb-edit .current-row .myColumn-button {
  display: block
}
.tb-edit .current-row .button-span {
  display: none
}
</style>

<style lang="scss" scoped>
.myColumn-button{
  position: relative;

  .el-input__inner {
    -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 40px;
    outline: none;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    width: 100%;
    padding-left: 15px;
    padding-right: 30px;
    cursor: pointer;

    &:focus{
      border-color: #1890ff;
    }
    &:hover{
      border-color: #1890ff;
    }
  }
  .el-input__suffix {
    position: absolute;
    height: 100%;
    right: 5px;
    top: 0;
    text-align: center;
    color: #C0C4CC;
    -webkit-transition: all .3s;
    transition: all .3s;
    pointer-events: none;
    cursor: pointer;

    .el-input__suffix-inner {
      pointer-events: all;

      .el-input__icon {
        height: 100%;
        width: 25px;
        text-align: center;
        transition: all .3s;
        line-height: 40px;
      }
    }

  }
}
</style>
