<template>
  <el-card>
    <div class="page-tools">
      <div class="left">
        <div v-if="$slots.left" class="tips">
          <i
            class="el-icon-info"
          />
          <slot name="left" />
          <!-- <span>总记录数: 16 条</span> -->
        </div>
      </div>
      <div class="right">
        <slot name="right" />
        <!-- <el-button type="warning" size="small">excel导入</el-button>
        <el-button type="danger" size="small">excel导出</el-button>
        <el-button type="primary" size="small">新增员工</el-button> -->
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  created() {
    // console.log(this.$slots)
  }
}
</script>

<style lang='scss' scoped>
.page-tools{
    display: flex;
    justify-content: space-between;
    align-items: center;
    i{
     color: rgb(96, 194, 255);
    }
    .tips{
        padding:8px 10px ;
        border: 1px solid rgb(122, 203, 252);
        border-radius: 5px;
        background-color: rgba(122, 203, 252,.2);
    }
}
</style>
