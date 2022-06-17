
<template>
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="height: 40px; width: 100%;"
  >
    <el-col :span="20">
      <span>{{ nodeData.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <!-- 两个内容 -->
        <el-col>{{ nodeData.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 element -->
          <el-dropdown @command="handleCommand">
            <span> 操作<i class="el-icon-arrow-down" /> </span>
            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!root" command="edit">编辑部门</el-dropdown-item>
              <!-- <el-dropdown-item v-if="!root" @click.native="delList">删除部门</el-dropdown-item> -->
              <!-- ele方法 指令事件 -->
              <el-dropdown-item v-if="!root" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { reqDelDepartments } from '@/api/departments'
export default {
  name: 'Departments',
  props: {
    // 节点的内容展示
    nodeData: {
      type: Object,
      required: true
    },
    // 是否根节点
    root: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    delList() {
      // console.log('点击删除了')
    },
    handleCommand(type) {
      if (type === 'add') {
        // console.log('添加操作')
        this.$emit('add-depts', this.nodeData)
      } if (type === 'edit') {
        // console.log('编辑操作')
        this.$emit('edit-depts', this.nodeData)
      }
      if (type === 'del') {
        // console.log('删除操作')
        this.$confirm('你确认要进行删除么?', '温馨提示').then(async() => {
          // 删除操作成功
          const a = await reqDelDepartments(this.nodeData.id)
          console.log(a)
          // 添加提示
          this.$message.success('删除操作成功')
          // 通知父组件更新
          this.$emit('del-depts')
        }).catch(error => {
          console.log(error)
        })
      }
    }
  }

}

</script>
