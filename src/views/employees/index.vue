<template>
  <div class="employees-container">
    <div class="app-container">
      <PageTools>
        <template #left>
          <span>总记录数:{{ total }} 条</span>
        </template>
        <template #right>
          <el-button type="warning" size="small">excel导入</el-button>
          <el-button type="danger" size="small">excel导出</el-button>
          <el-button type="primary" size="small" @click="showDialog = true">新增员工</el-button>
        </template>
      </PageTools>
      <el-card v-loading="loading " style="margin-top: 10px;">
        <el-table border :data="list">
          <el-table-column label="序号" type="index" :index="indexFn" sortable width="80" />
          <el-table-column label="姓名" prop="username" sortable />
          <el-table-column label="手机号" prop="mobile" sortable />
          <el-table-column label="工号" prop="workNumber" sortable />
          <el-table-column label="聘用形式" :formatter="formatEmployment" prop="formOfEmployment" sortable />
          <el-table-column label="部门" prop="departmentName" sortable />
          <el-table-column label="入职时间" prop="timeOfEntry" sortable>
            <template #default="{row}">
              <!-- 过滤器可以穿参数('YYYY-MM-DD') -->
              {{ row.timeOfEntry|formatTime }}
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable fixed="right" width="280">
            <template #default="{row}">
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="del(row.id)">删除</el-button>
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
      <AddEmployee :show-dialog.sync="showDialog" @renderList="getEmployeeList" />
    </div>
  </div>
</template>

<script>
// import moment from 'moment'
import AddEmployee from './components/AddEmployee.vue'
import { reqGetEmployeeList, reqDelEmployee } from '@/api/employees'
import obj from '@/constant/employees'
export default {
  name: 'Employees',
  // filters: {
  //   newTimeOfEntry() {
  //     return moment(this.timeOfEntry).format('YYYY-MM-DD')
  //   }
  // },
  components: {
    AddEmployee
  },
  data() {
    return {
      list: [],
      page: 1, // 当前页
      pageSize: 2, // 每页条数
      total: 0, // 总数
      loading: false,
      showDialog: false
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
      const { hireType } = obj
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
    }

  }
}
</script>

<style>

</style>

