<template>
  <el-dialog
    title="新增员工"
    :visible="showDialog"
    @close="handleClose"
    @click.native="handleDialogClick"
  >
    <!-- 表单 -->
    <el-form ref="addForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:50%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:50%" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择">
          <el-option
            v-for="item in hireType"
            :key="item.id"
            :value="item.id"
            :label="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <!-- v-model双向数据绑定
          1.:value=
          数据到视图的单向绑定
          2. @input 视图到数据的绑定 -->
        <el-input :value="formData.departmentName" style="width:50%" placeholder="请选择部门" @click.native.stop="handleClick" />
        <div v-if="isTreeShow" class="tree-box">
          <el-scrollbar>
            <el-tree
              v-loading="loading"
              :data="treeData"
              :props="defaultProps"
              @node-click="handleNodeClick"
            />
          </el-scrollbar>
        </div>
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click.native="clickSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { reqAddEmployee } from '@/api/employees'
import { reqGetDepartments } from '@/api/departments'
import { listToTree } from '@/utils/listToTree'
import obj from '@/constant/employees'
const { hireType } = obj
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        username: '', // 用户名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      },
      treeData: [],
      hireType: hireType,
      // arr: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      isTreeShow: false,
      loading: false,
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 4, message: '用户姓名为1-4位', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: ['blur', 'change'] },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: ['blur', 'change'] }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: ['blur', 'change'] }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: ['blur', 'change'] }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: ['blur', 'change'] }
        ],
        timeOfEntry: [
          { required: true, message: '请选择入职时间', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    handleClose() {
      this.isTreeShow = false
      this.$emit('update:showDialog', false)
      this.$refs.addForm.resetFields()
    },
    async handleClick() {
      this.loading = true
      this.isTreeShow = !this.isTreeShow
      if (!this.isTreeShow) return
      const { data: { depts }} = await reqGetDepartments()
      const treeData = listToTree(depts, '')
      this.treeData = treeData
      // this.arr = treeData
      this.loading = false
    },
    handleDialogClick() {
      this.isTreeShow = false
    },
    // 点击任意树形节点都会触发函数 data为点击目标
    handleNodeClick(data) {
      // 点击叶子节点
      if (data.children && data.children.length > 0) {
        return
      }
      // const flag = this.arr.some(item => item === this.formData.departmentName)

      // if (!flag) return this.$message.error('输入的部门不存在')

      this.formData.departmentName = data.name
      this.isTreeShow = false
    },
    clickSubmit() {
      // console.log(1111)
      this.$refs.addForm.validate(async flag => {
        if (!flag) return
        await reqAddEmployee(this.formData)
        this.$message.success('新增员工成功')
        this.handleClose()
        this.$emit('renderList')
        // 通过方法直接操作父组件 缺点明显 必须是父组件 不能被包裹
        // this.$parent.getEmployeeList()
      })
    }
  }

}
</script>

<style lang='scss' scoped>
.tree-box {
  position: absolute;
  width: 50%;
  min-height: 50px;
  left: 0;
  top: 45px;
  z-index: 100;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding-right: 5px;
  overflow: hidden;
  background-color: #fff;
  ::v-deep {
    .el-tree-node__content {
      height: auto;
    }
    .el-scrollbar{
      height: 100%;
    }
    .el-scrollbar__wrap{
      overflow-x: hidden;
    }
  }
}
</style>

