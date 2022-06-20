<template>
  <div class="import">
    <!-- 非必传 :on-success="handleSuccess" :before-upload="beforeUpload"-->
    <UploadExcel :on-success="handleSuccess" :before-upload="beforeUpload" />
    <!-- <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
    </el-table> -->
  </div>
</template>

<script>
import { reqAddEmployeeBatch } from '@/api/employees'

export default {
  data() {
    return {
      tableData: [],
      tableHeader: []
    }
  },
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (isLt1M) {
        return true
      }
      this.$message({
        message: '上传的文件不能超过1M',
        type: 'warning'
      })
      return false
    },
    handleSuccess({ results, header }) {
      this.tableData = results
      this.tableHeader = header
      // 是user页面跳转而来的
      if (this.$route.query.type === 'user') {
        this.handleEmployeeBatch(results, header)
      }
      // 薪资页面跳转
      if (this.$route.query.type === 'money') {
        console.log('薪资页面跳转')
      }
      // 社保页面
      if (this.$route.query.type === 'social') {
        console.log('社保页面跳转')
      }
      // this.$router.push('/employees')
    },
    // 处理员工批量导入
    async handleEmployeeBatch(results, header) {
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      // 将中文键名改成英文
      const arr = []
      results.forEach(item => {
        const userInfo = {}
        for (const key in item) {
          // if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
          if (['timeOfEntry', 'correctionTime'].includes(userRelations[key])) {
            userInfo[userRelations[key]] = this.formatExcelDate(item[key], '-')
          } else {
            userInfo[userRelations[key]] = item[key]
          }
        }
        arr.push(userInfo)
      })

      await reqAddEmployeeBatch(arr)
      this.$message.success('批量导入成功')
      this.$router.back()
    },
    // 将Excel时间1900年开始的 转成js识别的时间
    // numb要处理的值 format中间连接的元素
    formatExcelDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1) // 毫秒
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + (month < 10 ? '0' + month : month) + format + (date < 10 ? '0' + date : date)
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
