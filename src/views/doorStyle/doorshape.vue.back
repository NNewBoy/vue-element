<template>
  <div class="app-container">
    <el-backtop :bottom="50" />
    <el-row :gutter="2">
      <el-col :span="2">
        <el-popover
          placement="right"
          width="730"
          trigger="click"
        >
          <div>
            <el-checkbox v-model="checkBaseInfo" :indeterminate="checkBaseInfoIndet" @change="handleChkBaseInfoChange">基础信息</el-checkbox>
            <div class="paddingleft">
              <el-checkbox-group v-model="checkedBaseInfoArr" @change="handleChkBaseInfoArrChange">
                <el-checkbox v-for="val in baseInfoArr" :key="val" :label="val">{{ val }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div class="margintop">
            <el-checkbox v-model="checkParamG1" :indeterminate="checkParamG1Indet" @change="handleChkParamG1Change">门型参数1～6</el-checkbox>
            <div class="paddingleft">
              <el-checkbox-group v-model="checkedParamG1Arr" @change="handleChkParamG1ArrChange">
                <el-checkbox v-for="val in paramG1Arr" :key="val" :label="val">{{ val }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div class="margintop">
            <el-checkbox v-model="checkParamG2" :indeterminate="checkParamG2Indet" @change="handleChkParamG2Change">门型参数7～12</el-checkbox>
            <div class="paddingleft">
              <el-checkbox-group v-model="checkedParamG2Arr" @change="handleChkParamG2ArrChange">
                <el-checkbox v-for="val in paramG2Arr" :key="val" :label="val">{{ val }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <el-button slot="reference" size="mini">显示列</el-button>
        </el-popover>
      </el-col>
      <el-col :span="2">
        <el-button size="mini" @click="btnAddData">+ 新增</el-button>
      </el-col>
      <el-col :span="5">
        <el-input v-model="listQuery.code" prefix-icon="el-icon-search" size="mini" clearable placeholder="查找" />
      </el-col>
      <el-col :span="2">
        <el-button icon="el-icon-search" size="mini" @click="onSearch" />
      </el-col>
      <el-col :span="4">
        <upload-excel action="/doorshape/import" :on-success="onExcelSuccess" />
      </el-col>
    </el-row>
    <div style="height:20px" />
    <el-table
      id="table1"
      ref="singleTable1"
      v-loading="listLoading"
      :data="datas"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="40"><template slot-scope="scope">{{ scope.$index + 1 }}</template></el-table-column>
      <el-table-column align="center" label="操作" width="60">
        <template slot-scope="scope">
          <span class="el-tag el-tag--info el-tag--mini" style="cursor: pointer;" @click="btnAlterData(scope.row,scope.$index)">
            {{ scope.row.edit ? '保存' : '修改' }}
          </span>
          <span v-if="scope.row.edit" class="el-tag  el-tag--mini" style="cursor: pointer;" @click="btnCancel(scope.row,scope.$index)">取消</span>
          <span v-else class="el-tag el-tag--danger el-tag--mini" style="cursor: pointer;" @click="btnDelete(scope.row,scope.$index)">删除</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="图片" width="120px">
        <template slot-scope="{row}">
          <upload-pic
            :id="row.id"
            :pic="`kitdat/door/${row.preview_pic}`"
            :width="100"
            :height="120"
            action="/api/doorshape/uploadpic"
            :on-success="onUploadPicSuccess.bind(null, row)"
          />
        </template>
      </el-table-column>

      <el-table-column v-for="col in tableColumns" :key="col.key" :label="col.name" align="center" :width="col.width">
        <template slot-scope="scope">
          <span v-if="scope.row.edit">
            <span v-if="col.key == 'with_handle'">
              <el-checkbox v-model="scope.row[col.key]" />
            </span>
            <span v-else-if="col.key == 'alum_frame_door'">
              <el-checkbox v-model="scope.row[col.key]" />
            </span>
            <span v-else>
              <input v-model="scope.row[col.key]" type="text">
            </span>
          </span>
          <span v-else>
            <span v-if="col.key == 'with_handle'">
              <el-checkbox v-model="scope.row[col.key]" disabled />
            </span>
            <span v-else-if="col.key == 'alum_frame_door'">
              <el-checkbox v-model="scope.row[col.key]" disabled />
            </span>
            <span v-else :title="scope.row[col.key]" class="to">{{ scope.row[col.key] }}</span>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.per_page" @pagination="fetchDrShpList" />
  </div>
</template>

<script>
import { getDoorShapeList, updateDoorShape, addDoorShape, deleteDoorShape } from '@/api/doorstyle'
import { editDelete } from '@/utils/edit'
import Pagination from '@/components/Pagination'
import UploadExcel from '@/components/UploadExcel'
import UploadPic from '@/components/UploadPic'

const constBaseInfoArr = ['代码', '描述', '带拉手', '铝框门', '最小宽', '最小高', 'way', '说明']
const constParamG1Arr = ['参数01', '参数描述01', '参数02', '参数描述02', '参数03', '参数描述03', '参数04', '参数描述04', '参数05', '参数描述05', '参数06', '参数描述06']
const constParamG2Arr = ['参数07', '参数描述07', '参数08', '参数描述08', '参数09', '参数描述09', '参数10', '参数描述10', '参数11', '参数描述11', '参数12', '参数描述12']
const constInitCheckedArr = constBaseInfoArr.concat(constParamG1Arr)
const constFieldArr = [
  { key: 'door_shape_code', name: '代码', width: 0 },
  // { key: 'preview_pic', name: '图片', width: 100 },
  { key: 'desc', name: '描述', width: 0 },
  { key: 'with_handle', name: '带拉手', width: 50 },
  { key: 'alum_frame_door', name: '铝框门', width: 50 },
  // { key: 'dll', name: 'dll', width: 50 },
  // { key: 'keyword', name: 'keyword', width: 50 },
  { key: 'min_door_width', name: '最小宽', width: 0 },
  { key: 'min_door_height', name: '最小高', width: 0 },
  { key: 'way', name: 'way', width: 0 },
  { key: 'comment', name: '说明', width: 0 },
  { key: 'param1', name: '参数01', width: 0 },
  { key: 'param_desc1', name: '参数描述01', width: 0 },
  { key: 'param2', name: '参数02', width: 0 },
  { key: 'param_desc2', name: '参数描述02', width: 0 },
  { key: 'param3', name: '参数03', width: 0 },
  { key: 'param_desc3', name: '参数描述03', width: 0 },
  { key: 'param4', name: '参数04', width: 0 },
  { key: 'param_desc4', name: '参数描述04', width: 0 },
  { key: 'param5', name: '参数05', width: 0 },
  { key: 'param_desc5', name: '参数描述05', width: 0 },
  { key: 'param6', name: '参数06', width: 0 },
  { key: 'param_desc6', name: '参数描述06', width: 0 },
  { key: 'param7', name: '参数07', width: 0 },
  { key: 'param_desc7', name: '参数描述07', width: 0 },
  { key: 'param8', name: '参数08', width: 0 },
  { key: 'param_desc8', name: '参数描述08', width: 0 },
  { key: 'param9', name: '参数09', width: 0 },
  { key: 'param_desc9', name: '参数描述09', width: 0 },
  { key: 'param10', name: '参数10', width: 0 },
  { key: 'param_desc10', name: '参数描述10', width: 0 },
  { key: 'param11', name: '参数11', width: 0 },
  { key: 'param_desc11', name: '参数描述11', width: 0 },
  { key: 'param12', name: '参数12', width: 0 },
  { key: 'param_desc12', name: '参数描述12', width: 0 }
]

export default {
  components: { Pagination, UploadExcel, UploadPic },
  data() {
    return {
      listLoading: false,
      datas: [],
      total: 0,
      listQuery: { code: '', page: 1, per_page: 20 }, /** , code: undefined */
      checkBaseInfo: true,
      checkParamG1: true,
      checkParamG2: false,
      checkBaseInfoIndet: false,
      checkParamG1Indet: false,
      checkParamG2Indet: false,
      baseInfoArr: constBaseInfoArr,
      paramG1Arr: constParamG1Arr,
      paramG2Arr: constParamG2Arr,
      checkedBaseInfoArr: constBaseInfoArr,
      checkedParamG1Arr: constParamG1Arr,
      checkedParamG2Arr: [],
      checkedItemArr: constInitCheckedArr,
      tableColumns: [],
      tableHeaders: constFieldArr,
      editRow: constFieldArr,
      addNew: false,
      inputSearch: ''
    }
  },
  watch: {
    checkedItemArr(valArr) {
      this.tableColumns = this.tableHeaders.filter(v => valArr.indexOf(v.name) >= 0)
      this.key = this.key + 1
    }
  },
  created() {
    const code = this.$route.query.code
    if (code) {
      this.listQuery.code = code
    }
    this.fetchDrShpList()
    this.tableColumns = this.tableHeaders.filter(v => this.checkedItemArr.indexOf(v.name) >= 0)
  },
  methods: {
    async fetchDrShpList() {
      this.listLoading = true
      const { data } = await getDoorShapeList(this.listQuery)
      this.total = data.total
      const tmpArr = data.items
      for (let i = 0; i < tmpArr.length; i++) {
        tmpArr[i].edit = false
        tmpArr[i].with_handle = (tmpArr[i].with_handle === 1)
        tmpArr[i].alum_frame_door = (tmpArr[i].alum_frame_door === 1)
      }
      this.datas = tmpArr
      this.listLoading = false
      // console.log(data)
    },
    setCheckedItemArrData() {
      this.checkedItemArr = []
      this.checkedItemArr = this.checkedBaseInfoArr.concat(this.checkedParamG1Arr, this.checkedParamG2Arr)
    },
    handleChkBaseInfoChange(val) {
      this.checkedBaseInfoArr = val ? this.baseInfoArr : []
      this.checkBaseInfoIndet = false
      this.setCheckedItemArrData()
    },
    handleChkParamG1Change(val) {
      this.checkedParamG1Arr = val ? this.paramG1Arr : []
      this.checkParamG1Indet = false
      this.setCheckedItemArrData()
    },
    handleChkParamG2Change(val) {
      this.checkedParamG2Arr = val ? this.paramG2Arr : []
      this.checkParamG2Indet = false
      this.setCheckedItemArrData()
    },
    handleChkBaseInfoArrChange(valArr) {
      const checkedCount = valArr.length
      this.checkBaseInfo = checkedCount === this.baseInfoArr.length
      this.checkBaseInfoIndet = checkedCount > 0 && checkedCount < this.baseInfoArr.length
      this.setCheckedItemArrData()
    },
    handleChkParamG1ArrChange(valArr) {
      const checkedCount = valArr.length
      this.checkParamG1 = checkedCount === this.paramG1Arr.length
      this.checkParamG1Indet = checkedCount > 0 && checkedCount < this.paramG1Arr.length
      this.setCheckedItemArrData()
    },
    handleChkParamG2ArrChange(valArr) {
      const checkedCount = valArr.length
      this.checkParamG2 = checkedCount === this.paramG2Arr.length
      this.checkParamG2Indet = checkedCount > 0 && checkedCount < this.paramG2Arr.length
      this.setCheckedItemArrData()
    },
    isEditing(index) {
      for (let i = 0; i < this.datas.length; i++) {
        if (this.datas[i].edit && index !== i) {
          return true
        }
      }
      return false
    },
    btnAddData() {
      if (this.isEditing(-1)) {
        this.$message.warning('请先保存当前编辑项！')
      } else {
        this.listLoading = true
        this.addNew = true
        // edit: true, id: '', door_shape_code: '', alum_frame_door: 0, with_handle: 0, browse_desc: '', comment: '', desc: '', keyword: '', min_door_height: '', min_door_width: '', param1: '', param2: '', param3: '', param4: '', param5: '', param6: '', param7: '', param8: '', param9: '', param10: '', param11: '', param12: '', param_desc1: '', param_desc2: '', param_desc3: '', param_desc4: '', param_desc5: '', param_desc6: '', param_desc7: '', param_desc8: '', param_desc9: '', param_desc10: '', param_desc11: '', param_desc12: '', preview_pic: '', way: ''
        var newRow = { edit: true, door_shape_code: '', alum_frame_door: 0, with_handle: 0, comment: '', desc: '', keyword: '', min_door_height: '', min_door_width: '', param1: '', param2: '', param3: '', param4: '', param5: '', param6: '', param7: '', param8: '', param9: '', param10: '', param11: '', param12: '', param_desc1: '', param_desc2: '', param_desc3: '', param_desc4: '', param_desc5: '', param_desc6: '', param_desc7: '', param_desc8: '', param_desc9: '', param_desc10: '', param_desc11: '', param_desc12: '', preview_pic: '', way: '' }
        this.datas.unshift(newRow)
        this.listLoading = false
      }
    },
    insertData(row) {
      if (row.door_shape_code === '' || row.door_shape_code === null || row.door_shape_code === undefined) {
        this.$message.error('代码不能为空！')
      } else {
        row.with_handle = (row.with_handle === true) ? 1 : 0
        row.alum_frame_door = (row.alum_frame_door === true) ? 1 : 0
        // console.log(row)
        addDoorShape(row)
          .then(response => {
            console.log('response: ' + JSON.stringify(response))
            this.listLoading = false
            const re = response
            if (re['success']) {
              const data = re['data']
              if (data) {
                const id = re['data']['id']
                if (id) {
                  row.id = id
                  this.total += 1
                  row.edit = false
                  this.addNew = false
                  this.$message.info('增加成功！')
                } else {
                  this.$message.error('返回 id 为空！！')
                }
              } else {
                this.$message.error('返回 data 为空！')
              }
            } else {
              this.$message.error('增加失败！')
            }
          })
          .catch((e) => {
            this.$message.error('增加失败：' + e)
            this.listLoading = false
            console.log('增加失败：' + e)
          })
      }
    },
    btnAlterData(row, index) {
      // console.log(row)
      if (this.addNew) {
        this.insertData(row)
      } else {
        if (this.isEditing(index)) {
          this.$message.warning('请先保存当前编辑项！')
          return
        }
        if (this.datas[index].edit) {
          updateDoorShape(row)
            .then(response => {
              this.listLoading = false
              this.$message.editOk()
              this.datas[index].edit = false
            })
            .catch(() => {
              this.listLoading = false
            })
        } else {
          this.datas[index].edit = true
          for (const x in row) {
            if (row[x] === null || row[x] === undefined) this.editRow[x] = ''
            else this.editRow[x] = row[x]
          }
        }
      }
    },
    btnCancel(row, index) {
      if (this.addNew) {
        this.addNew = false
        this.datas.shift()
      } else {
        for (const x in row) {
          row[x] = this.editRow[x]
        }
        this.datas[index].edit = false
      }
    },
    btnDelete(row, index) {
      editDelete(() => {
        this.listLoading = true
        deleteDoorShape(row.id).then(response => {
          this.$notify.deleteOk()
          this.datas.splice(index, 1)
          this.total -= 1
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      })
    },
    onSearch() {
      this.listQuery.page = 1
      this.fetchDrShpList()
    },
    onExcelSuccess({ results, header }) {
      this.fetchDrShpList()
    },
    onUploadPicSuccess(row, res, file) {
      if (res.success) {
        const tmp = row.preview_pic
        row.preview_pic = null
        row.preview_pic = tmp
        this.$notify.uploadOk()
      } else {
        this.$notify.uploadError()
      }
    }
  }
}
</script>

<style scoped>
  .margintop{
    margin-top: 20px;
  }
  .paddingleft{
    padding-left: 25px;
  }
  #table1 input {
    font-size: 12px;
		display: block;
    width: 100%;
    height: 28px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin: 3px 0;
    padding: 6px 2px;
    transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
	}
  #table1 input:focus {
    border-color: #66afe9;
    box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6);
    outline: 0px;
  }
  #div-preview{
    width: 100%;
    height: 80px;
  }
  #img-preview{
    width: 100%;
    height: 100%;
  }
  .to {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }
</style>
