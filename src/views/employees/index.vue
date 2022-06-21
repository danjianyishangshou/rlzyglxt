<template>
  <div class="employees-container">
    <div class="app-container">
      <PageTools>
        <template #left>
          <span>总记录数:{{ total }} 条</span>
        </template>
        <template #right>
          <!-- $router.push('/import?type=user')用于判断那个页面发起的跳转 -->
          <el-button v-if="showBtn('EXCEL_EXPORT')" type="warning" size="small" @click="$router.push('/import?type=user')">excel导入</el-button>
          <el-button v-if="showBtn('EXCEL_IMPORT')" type="danger" size="small" @click="clickExport">excel导出</el-button>
          <el-button type="primary" size="small" @click="showDialog = true">新增员工</el-button>
        </template>
      </PageTools>
      <el-card v-loading="loading " style="margin-top: 10px;">
        <el-table border :data="list">
          <el-table-column label="序号" type="index" :index="indexFn" sortable width="80" />
          <el-table-column label="姓名" prop="username" sortable />
          <el-table-column label="头像" prop="staffPhoto" sortable>
            <template #default="{row}">
              <img
                v-imgError="imgError"
                :src="row.staffPhoto||defaultImg"
                alt=""
                class="staff-p"
                @click="clickShowCodeDialog(row.staffPhoto)"
              >
            </template>
          </el-table-column>
          <el-table-column label="手机号" prop="mobile" sortable />
          <el-table-column label="工号" prop="workNumber" sortable />
          <el-table-column label="聘用形式" :formatter="formatEmployment" prop="formOfEmployment" sortable />
          <el-table-column label="部门" prop="departmentName" sortable />
          <el-table-column label="入职时间" sortable>
            <template #default="{row}">
              <!-- 过滤器可以穿参数('YYYY-MM-DD') -->
              {{ row.timeOfEntry|formatTime }}
            </template>
          </el-table-column>
          <el-table-column label="转正时间" sortable>
            <template #default="{row}">
              <!-- 过滤器可以穿参数('YYYY-MM-DD') -->
              {{ row.correctionTime|formatTime }}
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable fixed="right" width="280">
            <template #default="{row}">
              <el-button type="text" size="small" @click="$router.push('/employees/detail/'+row.id)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
              <el-button :disabled="!clickBtnPermission('point-user-delete')" type="text" size="small" @click="del(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <div style="height: 60px; margin-top: 10px">
          <el-pagination
            :current-page="page"
            :page-sizes="[1,2,3,4,5,6,7,8,9]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
      <!-- 新增员工弹窗 -->
      <AddEmployee
        :show-dialog.sync="showDialog"
        @renderList="getEmployeeList"
      />
      <el-dialog
        title="显示二维码"
        :visible="showCodeDialog"
        width="30%"
        @close="closeDialog"
      >
        <div class="imgQR">
          <canvas ref="imgQR">
            1
          </canvas>
        </div>
      </el-dialog>
      <!-- 分享展示, 预览的二维码的弹层 -->
      <!-- <el-dialog title="二维码" :visible="showCodeDialog" @close="closeDialog">
        二维码
      </el-dialog> -->
      <AssignRole :show-role-dialog.sync="showRoleDialog" :user-id="userId" />
    </div>
  </div>
</template>

<script>
// import moment from 'moment'
import QrCode from 'qrcode'
import AddEmployee from './components/AddEmployee.vue'
import imgError from '@/assets/common/head.jpg'
import { reqGetEmployeeList, reqDelEmployee } from '@/api/employees'
import obj from '@/constant/employees'
const { hireType } = obj
import dayjs from 'dayjs'
import AssignRole from './components/assign-role.vue'
// 引入混入
import check from '@/mixins/check'
export default {
  name: 'Employees',
  // filters: {
  //   newTimeOfEntry() {
  //     return moment(this.timeOfEntry).format('YYYY-MM-DD')
  //   }
  // },
  components: {
    AddEmployee,
    AssignRole
  },
  // 使用混入
  mixins: [check],
  data() {
    return {
      list: [],
      page: 1, // 当前页
      pageSize: 2, // 每页条数
      total: 0, // 总数
      loading: false,
      showDialog: false,
      defaultImg: 'https://img1.baidu.com/it/u=310131527,3224816793&fm=253&fmt=auto&app=138&f=JPEG?w=493&h=488',
      imgError: imgError,
      showCodeDialog: false,
      showRoleDialog: false,
      userId: ''
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      this.loading = true
      const { data } = await reqGetEmployeeList(this.page, this.pageSize)
      const { total, rows } = data
      this.total = total
      this.list = rows
      this.loading = false
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.page = 1
      this.getEmployeeList()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getEmployeeList()
    },
    indexFn(index) {
      return index + 1 + this.pageSize * (this.page - 1)
    },
    // 改变属性
    formatEmployment(row, column, cellValue, index) {
      // 这个函数用于格式化单元格的内容，
      // 这个函数地返回值将作为、单元格最后的内容

      const res = hireType.find(item => item.id === +cellValue)
      return res ? res.value : '未知'
    },
    del(id) {
      this.$confirm('你确认要进行删除么?', '温馨提示').then(async() => {
        // 删除操作成功
        await reqDelEmployee(id)
        // 添加提示
        this.$message.success('删除操作成功')
        // 是最后一页的最后的一项 返回上一页
        if (this.list.length === 1 && this.page > 1) {
          this.page--
        }
        this.getEmployeeList()
      }).catch(error => {
        console.log(error)
      })
    },
    async  clickExport() {
      const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
      const merges = ['A1:A2', 'B1:F1', 'G1:G2']
      const headersArr = ['姓名', '手机号', '入职日期', '聘用形式', '转正日期', '工号', '部门']
      const { data: { rows }} = await reqGetEmployeeList(1, this.total)
      // 英文对照表
      // console.log(rows)
      // const headersRelations = {
      //   '姓名': 'username',
      //   '手机号': 'mobile',
      //   '入职日期': 'timeOfEntry',
      //   '聘用形式': 'formOfEmployment',
      //   '转正日期': 'correctionTime',
      //   '工号': 'workNumber',
      //   '部门': 'departmentName'
      // }
      const arr = ['username', 'mobile', 'timeOfEntry', 'formOfEmployment', 'correctionTime', 'workNumber', 'departmentName']// 对照数组
      const dataArr = this.toggleArr(rows, arr)
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: headersArr,
          // 设置表格的主体数据有固定的的格式二维数组
          // 为什么是大数组套小数组？=>数组里面的数据是有顺序的！！！
          // 1.大数组是为了保证每条的数据是有顺序的！！！
          // 2.小数组是为了保证每条数据每一个信息也是有顺序的！！！
          data: dataArr,
          filename: '员工信息',
          autoWidth: true,
          bookType: 'xlsx',
          // 多重表头
          multiHeader,
          // 合并单元格
          merges
        })
      })
    },
    // 处理数据
    toggleArr(a, b) {
      // a表示数据 b是表头对应表
      const arr = []
      a.forEach(item => {
        const newArr = []

        b.forEach(e => {
          if (['timeOfEntry', 'correctionTime'].includes(e)) {
            item[e] = dayjs(item[e]).format('YYYY年MM月DD日')
          }
          if (e === 'formOfEmployment') {
            const res = hireType.find(v => v.id === +item[e])
            item[e] = res ? res.value : '未知'
          }
          newArr.push(item[e])
        })

        arr.push(newArr)
      })
      return arr
    },
    // 将表头数据和数据进行对应
    formatJson(rows, headersArr, headersRelations) {
      // [
      //   [ 值1, 值2, 值3, ... ]
      // ]
      const resultsArr = rows.map(item => {
        const arr = []
        headersArr.forEach(key => {
          const englishKey = headersRelations[key]
          arr.push(item[englishKey])
        })
        return arr
      })
      return resultsArr
    },
    clickShowCodeDialog(url) {
      this.showCodeDialog = true
      // 应为vue是异步更新 获取dom较慢
      this.$nextTick(() => {
        QrCode.toCanvas(this.$refs.imgQR, url)
      })
    },
    closeDialog() {
      this.showCodeDialog = false
    },
    editRole(id) {
      this.showRoleDialog = true
      this.userId = id
    },

    showBtn(str) {
      if (!this.clickBtnPermission(str)) {
        return false
      } else {
        return true
      }
    }

  }
}
</script>

<style lang='scss' scoped>
.staff-p{
  width: 70px;
  height: 70px;
}
.imgQR{
  text-align: center;
}
</style>

