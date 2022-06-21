<template>
  <el-dialog
    class="assign-role"
    title="分配角色"
    :visible="showRoleDialog"
    @close="showDialog"
    @open="handleCloseDialog"
  >
    <el-checkbox-group v-model="checkList" v-loading="loading">
      <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
    </el-checkbox-group>
    <template #footer>
      <el-button type="primary" size="small" @click="clickSubmit">确定</el-button>
      <el-button size="small" @click="showDialog">取消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { reqGetRoleList, reqAssignRoles } from '@/api/setting'
import { reqGetBaseInfo } from '@/api/user'
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    // 用户的id 用来查询当前用户的角色信息
    userId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      checkList: [],
      roleList: [],
      loading: false
    }
  },
  methods: {
    handleCloseDialog() {
      this.getRoleList()
      this.getEmployeeDetail()
      // 利用Promise开关闭loading
      // 处理请求并发事件
    //   this.loading = true
    //   Promise.all([this.getRoleList(), this.getEmployeeDetail()]).finally(res => {
    //     this.loading = false
    //   })
    },
    showDialog() {
      this.$emit('update:showRoleDialog', false)
      this.checkList = []
    },
    async  getRoleList() {
      this.loading = true
      const { data: { rows }} = await reqGetRoleList(1, 99999)
      this.roleList = rows
    },
    // reqGetBaseInfo
    async getEmployeeDetail() {
      try {
        const { data: { roleIds }} = await reqGetBaseInfo(this.userId)
        this.checkList = roleIds
      } finally {
        this.loading = false
      }
    },
    async clickSubmit() {
      await reqAssignRoles(this.userId, this.checkList)
      this.$message.success('分配角色成功')
      this.showDialog()
    }
  }
}
</script>
