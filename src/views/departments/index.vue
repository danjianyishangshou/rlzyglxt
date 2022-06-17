<template>
  <div class="departments-container">
    <div class="app-container">
      <el-card class="tree-card" :loading="loading">
        <!-- 用了一个行列布局 -->

        <!-- <TreeTools :node-data="company" :root="true" />-->
        <!-- 简写 -->
        <TreeTools
          :node-data="company"
          root
          @del-depts="getDepartments"
          @add-depts="addDeptsFn"
          @edit-depts="editDeptsFn"
        />
        <!-- <el-tree :data="list" :default-expand-all="true" /> -->
        <!-- 简写 -->
        <el-tree :data="departs" default-expand-all :props="defaultProps">
          <template #default="{data}">
            <TreeTools :node-data="data" @add-depts="addDeptsFn" @edit-depts="editDeptsFn" @del-depts="getDepartments" />
          </template>
        </el-tree>
      </el-card>
      <AddDept
        ref="addDept"
        :show-dialog.sync="showDialog"
        :new-data="newData"
        :dept-list="deptList"
        @add-dept="getDepartments"
      />
    </div>
  </div>
</template>

<script>
import AddDept from './components/AddDept.vue' // 引入新增部门组件
import TreeTools from './components/TreeTools.vue'
import { reqGetDepartments } from '@/api/departments'
import { listToTree } from '@/utils/listToTree'
export default {
  name: 'Departments',
  components: {
    TreeTools,
    AddDept

  },
  data: function() {
    return {
      // 树形数据[{}，{}，{}]
      // 一个对象就是一个树形节点，label属性设置文字描述，children设置孩子节点
      // 一个节点就是一个对象，一定会有一个label属性进行文字描述，有孩子属性才需要children属性
      // el-tree组件是支持文字描述字段名label和孩子节点字段名children的自定义 利用:props="defaultProps"
      departs: [],
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      company: { name: '小柠檬科技股份有限公司', manager: '负责人' },
      showDialog: false,
      newData: {}, // 保留将来新增子部门时的父级部门数据
      deptList: [],
      loading: false
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      this.loading = true

      // 检查代码加载结果的时候调用的
      // await new Promise((resolve, reject) => {
      //   setTimeout(() => {
      //     resolve()
      //   }, 2000)
      // })

      const { data: { depts, companyName }} = await reqGetDepartments()
      this.deptList = depts
      this.departs = listToTree(depts, '')
      this.company.name = companyName
      this.company.id = ''
      // console.log(111111111)
      this.loading = false
    },

    addDeptsFn(nodeDate) {
      this.showDialog = true
      this.newData = nodeDate
      // 改变标题 也可以使用计算属性
      // this.$refs.addDept.showTitle = '添加子部门'
    },

    editDeptsFn(nodeDate) {
      this.showDialog = true
      this.newData = nodeDate
      // this.$refs.addDept.showTitle = '编辑部门'
      // 打开页面窗口的时候调用 getDepartDetail 显示回显数据
      this.$refs.addDept.getDepartDetail(nodeDate.id)
    }

  }
}
</script>

<style scoped lang='scss'>

.el-tree {
  ::v-deep {
    .el-tree-node__expand-icon.expanded {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    .el-icon-caret-right:before {
      background: url("~@/assets/common/add-circle.png") no-repeat 0 0;
      content: '';
      display: block;
      width: 16px;
      height: 16px;
      font-size: 16px;
      background-size: 16px;
    }

    .el-tree-node__expand-icon.expanded.el-icon-caret-right:before{
      background: url("~@/assets/common/minus-circle.png") no-repeat 0 0;
      content: '';
      display: block;
      width: 16px;
      height: 16px;
      font-size: 16px;
      background-size: 16px;
    }

    .el-tree-node__expand-icon.is-leaf::before  {
      background: url("~@/assets/common/user-filling.png") no-repeat 0 0;
      content: '';
      display: block;
      width: 16px;
      height: 16px;
      font-size: 16px;
      background-size: 16px;
    }
  }
}
</style>
