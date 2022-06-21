<template>
  <div class="permission-container">
    <div class="app-container">
      <!-- 表格 -->
      <el-card>
        <div style="text-align: right; margin-bottom: 20px" @close="showPermission">
          <el-button type="primary" size="small" @click="addPermission(1,'0')"> 添加权限</el-button>
        </div>
        <el-table border :data="list" row-key="id">
          <el-table-column label="名称" prop="name" />
          <el-table-column label="标识" prop="code" />
          <el-table-column label="描述" prop="description" />
          <el-table-column label="操作">
            <template #default="{row}">
              <el-button v-if="row.type===1" size="small" type="text" @click="addPermission(2,row.id)">添加权限点</el-button>
              <el-button size="small" type="text" @click="getPermissionDetail(row.id)">查看</el-button>
              <el-button size="small" type="text" @click="delPermission(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!-- 新增编辑的弹层 -->
      <el-dialog :visible="showDialog" :title="title" @close="showDialog = false">
        <!-- 表单内容 -->
        <el-form label-width="100px">
          <el-form-item label="权限名称">
            <el-input v-model="formData.name" />
          </el-form-item>
          <el-form-item label="权限标识">
            <el-input v-model="formData.code" />
          </el-form-item>
          <el-form-item label="权限描述">
            <el-input v-model="formData.description" />
          </el-form-item>
          <el-form-item label="权限启用">
            <el-switch
              v-model="formData.enVisible"
              active-text="启用"
              active-value="1"
              inactive-text="不启用"
              inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
              />
            </el-switch></el-form-item>
        </el-form>

        <template #footer>
          <div style="text-align: right;">
            <el-button @click="showDialog = false">取消</el-button>
            <el-button type="primary" @click="clickSubmit">确定</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { reqGetPermissionList, reqAddPermission, reqDelPermission, reqGetPermissionDetail, reqUpdatePermission } from '@/api/permission'
import { listToTree } from '@/utils/listToTree'
export default {
  name: 'Permission',
  data() {
    return {
      list: [],
      showDialog: false,
      value: true,
      formData: {
        enVisible: '0', // 启用禁用, 0禁用, 1启用
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        type: '', // 类型标记了一级(页面访问权) 二级(按钮操作权)
        pid: '' // 添加到哪个节点下
      }
    }
  },
  computed: {
    title() {
      return this.formData.id ? '编辑权限' : '添加权限'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() {
      const { data } = await reqGetPermissionList()
      // 所有的一级部门pid 等于0

      this.list = listToTree(data, '0')
    },
    addPermission(type, pid) {
      this.showDialog = true
      // this.formData = { ...this.formData, type: type, pid }
      this.formData.type = type
      this.formData.pid = pid
    },
    showPermission() {
      this.showDialog = false
      this.formData = {
        enVisible: '0',
        name: '',
        code: '',
        description: '',
        type: '',
        pid: ''
      }
    },
    async clickSubmit() {
      if (this.formData.id) {
        await reqUpdatePermission(this.formData)
        this.$message.success('编辑权限成功')
        this.showPermission()
        this.getPermissionList()
      } else {
        await reqAddPermission(this.formData)
        this.$message.success('添加权限成功')
        this.showPermission()
        this.getPermissionList()
      }
    },
    delPermission(id) {
      this.$confirm('你确定要删除该权限么？', '温馨提示').then(async() => {
        await reqDelPermission(id)
        this.$message.success('删除权限成功')
        this.getPermissionList()
      }).catch((err) => {
        console.log(err)
      })
    },
    async  getPermissionDetail(id) {
      this.showDialog = true
      const { data } = await reqGetPermissionDetail(id)
      this.formData = data
    }
  }

}
</script>
