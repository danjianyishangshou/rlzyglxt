<template>
  <!-- 放置弹层组件 -->
  <!-- 对话框的关闭不是给X注册点击事件！！！组件内部帮你点击了X号/或者朦层，触发一个close事件 -->
  <!-- el-dialog组件open事件是在弹窗显示的时候触发 -->
  <el-dialog :title="showTitle" :visible="showDialog" @close="handleClose" @open="getEmployeeSimple">
    <el-form ref="form" label-width="120px" :model="form" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="form.name" style="width:80%" placeholder="1-10个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="form.code" style="width:80%" placeholder="1-10个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="form.manager" style="width:80%" placeholder="请选择">
          <!--el-option label设置展示给用户看的文字信息value收集展示给后台的-->
          <el-option v-for="item in userList" :key="item.id" :value="item.username" :label="item.username" />
        </el-select></el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="form.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button size="small" @click="handleClose">取消</el-button>
      <el-button size="small" type="primary" @click="clickSubmit">确认</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { reqGetEmployeeSimple } from '@/api/user'
import { reqAddDepartment, reqGetDepartDetail, reqUpdateDepartments } from '@/api/departments'
export default {
  // 需要传入一个props变量来控制 显示或者隐藏
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    // 需要父级数据 主要是id
    newData: {
      type: Object,
      required: true
    },
    // 原始列表数据需要 pid数据
    deptList: {
      type: Array,
      required: true
    }
  },

  data() {
    const validatorName = (rule, value, callback) => {
      let arr = []
      if (this.form.id) {
        if (this.newData.name === value) {
          callback()
          return
        }
        arr = this.deptList.filter(item => item.pid === this.newData.pid)
      } else {
        // 添加模块
        // console.log(value, this.newData, this.deptList)
        // 1,根据父级部门的id和原始列表数据去找出所有的兄弟部门
        arr = this.deptList.filter(item => item.pid === this.newData.id)
      }
      // 2,根据兄弟部门去比对，只要有一个和value相同，此时重复
      const isRepeat = arr.some(item => item.name === value)
      // 3.callback()
      // if (isRepeat) {
      //   callback(new Error('同级部门中已经出现该名称'))
      // } else {
      //   callback()
      // }
      isRepeat ? callback(new Error('同级部门中已经出现该名称')) : callback()
      // if (arr.includes(value)) {
      //   console.log(1)
      // }
    }
    const validatorCode = (rule, value, callback) => {
      if (this.form.id && this.newData.code === value) {
        callback()
        return
      }
      const isRepeat = this.deptList.some(item => item.code === value)
      isRepeat ? callback(new Error('部门编码已经重复')) : callback()
    }
    return {
      form: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      // 注意同级部门中不能增加相同的部门名字
      rules: {
        name: [
          { required: true, message: '部门名字不能为空', tagger: ['blur', 'change'] },
          { min: 1, max: 10, message: '长度为1-10位', tagger: ['blur', 'change'] },
          { validator: validatorName, message: '同部门子部门名字不能相同', tagger: ['blur'] }
        ],
        code: [
          { required: true, message: '部门编号不能为空', tagger: ['blur', 'change'] },
          { min: 1, max: 10, message: '长度为1-10位', tagger: ['blur', 'change'] },
          { validator: validatorCode, message: '编码不能相同', tagger: ['blur'] }
        ],
        manager: [
          { required: true, message: '责任人必填', tagger: ['blur', 'change'] }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', tagger: ['blur', 'change'] },
          { min: 1, max: 300, message: '长度为1-300个字符', tagger: ['blur', 'change'] }
        ]
      },
      userList: [] // 负责人列表
      // showTitle: '标题'
    }
  },
  computed: {
    showTitle() {
      return this.form.id ? '编辑部门' : '添加子部门'
    }
  },
  created() {
    // 组件一加载 就可以显示负责人了
    // 不能在弹窗前发请求
  },
  methods: {
    handleClose() {
      this.$emit('update:showDialog', false)
      // 清空表单
      // 注意点：resetFields不能清空表单之外的内容r
      this.$refs.form.resetFields()
      this.form = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
    },
    async getEmployeeSimple() {
      // 弹窗显示了

      const { data } = await reqGetEmployeeSimple()

      this.userList = data
    },
    clickSubmit() {
      // 因为我们dialog将来要负责新增（已完成）和编辑
      // 先整体表单 可以共用
      this.$refs.form.validate(async(flag) => {
        if (!flag) return
        // 检验成功可以发送请求了
        // 判断触发对象 是添加还是编辑
        if (this.form.id) {
          // 编辑
          const res = await reqUpdateDepartments(this.form)
          console.log('更新编辑部门', res)
          this.$message.success('编辑部门成功')
        } else {
          // 添加
          await reqAddDepartment({
            ...this.form,
            pid: this.newData.id// 新增的部门的父级的数据的id
          })
          this.$message.success('添加部门成功')
        }
        // 以下 都要复用
        // 关闭窗口
        this.handleClose()
        // 通知父组件渲染列表
        this.$emit('add-dept')
      })
    },
    async getDepartDetail(id) {
      const { data } = await reqGetDepartDetail(id)
      // console.log(data)
      this.form = data
    }
  }
}
</script>
