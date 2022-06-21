<template>
  <div class="setting-container">
    <div class="app-container">
      <el-card v-loading="loading">
        <el-tabs v-model="activeName">
          <el-tab-pane label="角色管理" name="first">
            <!-- 按钮 -->
            <el-button type="success" @click="addRole">+ 新增角色</el-button>
            <!-- 表格 -->
            <el-table :data="list" style="width: 100%">
              <el-table-column
                type="index"
                label="序号"
                width="100"
                :index="indexFn"
              />
              <el-table-column prop="name" label="角色名称" width="220" />
              <el-table-column prop="description" label="描述" />
              <el-table-column label="操作">
                <!-- <template #default="obj"> -->
                <template #default="{row}">
                  <!-- obj中数据{row:每一行的数据，column,$index} -->
                  <!-- {{ row }} -->
                  <el-button type="success" size="small" @click="assign(row.id)">分配权限</el-button>
                  <el-button type="primary" size="small" @click="editRole(row.id)">编辑</el-button>
                  <el-button type="danger" size="small" @click="del(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <!-- @size-change="handleSizeChange" -->
            <!-- @current-change="handleCurrentChange" -->
            <!-- <el-pagination
              :current-page="page"
              :page-sizes="[1,2,3,4,5]"
              :page-size="pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            /> -->
            <el-pagination
              :current-page="page"
              :page-sizes="[1, 2, 3, 4, 5, 6, 7, 8, 9]"
              :page-size="pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </el-tab-pane>
          <el-tab-pane label="公司信息" name="second">
            <!-- 警告信息 -->
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <!-- 表单 -->
            <!-- 表单 -->
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="companyForm.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="companyForm.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="companyForm.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="companyForm.remarks" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <el-dialog :title="isTitle" :visible="showDialog" @close="handleCloseDialog">
        <!-- <el-form ref="roleForm" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入角色名称" style="width=80%" />
          </el-form-item>
          <el-form-item label="角色介绍" prop="description">
            <el-input v-model="form.description" placeholder="请输入角色介绍" />
          </el-form-item>
        </el-form> -->
        <el-form ref="roleForm" :model="form" :rules="rules" label-width="100px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入角色名称" />
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input v-model="form.description" placeholder="请输入角色描述" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button size="small" type="primary" @click="handleCloseDialog">取消</el-button>
          <el-button size="small" type="primary" @click="clickSubmit"> 确认</el-button>
        </template>
      </el-dialog>
      <!-- 分配权限的弹层 -->
      <el-dialog title="分配权限" :visible="showAssignDialog" @close="closeAssignDialog">
        <el-tree
          ref="tree"
          :data="treeList"
          :props="{label:'name'}"
          default-expand-all
          show-checkbox
          check-strictly
          node-key="id"
        />
        <!-- <el-tree :data="treeList" :props="defaultProps" /> -->
        <template #footer>
          <div style="text-align: right;">
            <el-button @click="closeAssignDialog">取消</el-button>
            <el-button type="primary" @click.native="clickAssignSubmit">确定</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { reqGetPermissionList } from '@/api/permission'
import { listToTree } from '@/utils/listToTree'
import { reqGetRoleList, reqDelRoleList, reqAddRole, reqGetRoleDetail, reqUpDataRole, reqAssignPerm } from '@/api/setting'
import { reqGetCompanyById } from '@/api/company'
import { mapState } from 'vuex'
export default {
  name: 'Setting',
  data() {
    return {
      // 默认展示name等于second的组件
      activeName: 'second',
      list: [],
      treeList: [],
      // defaultProps: {
      //   children: 'children',
      //   label: 'name'
      // },
      page: 1,
      pagesize: 3,
      total: 10,
      loading: false,
      showDialog: false,
      showAssignDialog: false,
      roleId: '', // 分配权限
      rules: {
        name: [{
          required: true, message: '不能为空', tagger: ['blur', 'change']
        }],
        description: [{
          required: true, message: '不能为空', tagger: ['blur', 'change']
        }]
      },
      form: {
        name: '',
        description: ''
      },
      isTitle: '标题',
      companyForm: {
        name: '',
        companyAddress: '',
        mailbox: '',
        remarks: ''
      }
    }
  },
  computed: {
    ...mapState('user', ['userInfo'])
  },
  created() {
    this.getRoleList()
    this.getCompanyById()
  },
  methods: {
    async getRoleList() {
      this.loading = true
      const {
        data: { rows, total }
      } = await reqGetRoleList(this.page, this.pagesize)
      // console.log(rows, tatol)

      this.total = total
      this.list = rows
      this.loading = false
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.page = 1
      this.getRoleList()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.page = val
      this.getRoleList()
    },
    // 从0开始的行号
    indexFn(index) {
      //  index 从0开始的数据
      // index +1 +当前前面有多少条数据
      return 1 + index + this.pagesize * (this.page - 1)
    },
    del(id) {
      this.$confirm('你确认要进行删除么?', '温馨提示').then(async() => {
        // 删除操作成功
        const res = await reqDelRoleList(id)
        console.log(res)
        // 添加提示
        this.$message.success('删除操作成功')
        // 注意：发现是本页最后一条数据且删除成功，回到上一页
        if (this.list.length === 1 && this.page > 1) {
          this.page--
        }
        // 更新页面
        this.getRoleList()
      }).catch(error => {
        console.log(error)
      })
    },
    clickSubmit() {
      this.$refs.roleForm.validate(async flag => {
        if (!flag) return
        if (this.form.id) {
          const res = await reqUpDataRole(this.form)
          this.$message.success(res.message)
        } else {
          const res = await reqAddRole(this.form)
          this.$message.success(res.message)
        }
        this.handleCloseDialog()
        this.getRoleList()
      })
    },
    handleCloseDialog() {
      this.showDialog = false
      this.$refs.roleForm.resetFields()
    },
    addRole() {
      this.showDialog = true
      this.isTitle = '添加角色'
    },
    async editRole(id) {
      this.showDialog = true
      this.isTitle = '编辑角色'
      const { data } = await reqGetRoleDetail(id)
      // console.log(data)
      this.form = data
    },
    async  getCompanyById() {
      const res = await reqGetCompanyById(this.userInfo.companyId)
      this.companyForm = res.data
    },
    // 打开分配权限对话框
    async  assign(id) {
      this.roleId = id
      this.showAssignDialog = true
      const { data } = await reqGetPermissionList()
      this.treeList = listToTree(data, '0')
      // 数据回显
      const { data: { permIds }} = await reqGetRoleDetail(id)

      this.$refs.tree.setCheckedKeys(permIds)
    },
    // 关闭分配权限对话框
    closeAssignDialog() {
      this.showAssignDialog = false
      this.$refs.tree.setCheckedKeys([])
    },
    async clickAssignSubmit() {
      await reqAssignPerm({
        id: this.roleId,
        permIds: this.$refs.tree.getCheckedKeys()
      })
      this.$message.success('分配成功')
      this.showAssignDialog = false
    }
  }
}
</script>

<style>
</style>

