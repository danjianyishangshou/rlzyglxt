<template>
  <div class="image-upload">
    <!-- action="https://jsonplaceholder.typicode.com/posts/" -->
    <el-upload
      action="#"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :file-list="fileList"
      :limit="count"
      :class="{disabled:isDisabled}"
      :http-request="handleUpload"
      :on-change="handleChange"
      :before-upload="beforeUpload"
    >
      <i class="el-icon-plus" />
      <!-- <el-progress type="circle" :percentage="100" status="success" /> -->
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
// 1 下载 yarn add cos-js-sdk-v5
// 2 导入
import COS from 'cos-js-sdk-v5'
// 3 构造实例
var cos = new COS({
  SecretId: 'AKIDf8KGvJQGwMaYFfog8PQChvsYx5yc1A4i', // 身份识别 ID
  SecretKey: 'PYS6UbS4QWLvFJ6ex4vWsynMfjX5NQDk' // 身份密钥
})
export default {
  props: {
    count: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      // percentage: 0,
      fileList: [
        {
          url: 'https://img2.baidu.com/it/u=4244269751,4000533845&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
        },
        {
          url: 'https://img0.baidu.com/it/u=338333132,3874932036&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
        }

      ]
    }
  },
  computed: {
    isDisabled(count) {
      return this.fileList.length >= this.count
    },
    isAllUploadSuccess() {
      return this.fileList.every(item => item.status === 'success')
    }
  },
  methods: {
    handleRemove(file, fileList) {
      // 1
      // const index = this.fileList.findIndex(item => {
      //   return item === file
      // })
      // this.fileList.splice(index, 1)
      // 2
      // this.fileList = fileList
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleUpload(obj) {
      // console.log('上传', obj.file)
      const fileObj = this.fileList.find(item => item.uid === obj.file.uid)
      fileObj.status = 'uploading'
      cos.putObject({
        Bucket: 'hrsaas-1312559985', /* 填入您自己的存储桶，必须字段 */
        Region: 'ap-shanghai', /* 存储桶所在地域，例如ap-beijing，必须字段 */
        Key: parseInt(Math.random() * 99999) + obj.file.name, /* 存储在桶里的对象键（必须字段 */
        StorageClass: 'STANDARD', // 存储类型
        Body: obj.file, // 上传文件对象
        // 上传的进度, 上传的过程中实时触发onProgress, 可以做进度条的展示
        onProgress: progressData => {
          // console.log(progressData)
          // this.percentage = parseInt(progressData.percent * 100)
          fileObj.percentage = parseInt(progressData.percent * 100)
        }
      }, (err, data) => {
        // console.log(err || data)
        if (err) {
          console.log(err)
          return
        }
        // 网好的时候也会看到进度条 增加用户体验
        setTimeout(() => {
          fileObj.status = 'success'
        }, 1000)
        fileObj.url = 'https://' + data.Location
      })
    },
    handleChange(file, fileList) {
      console.log(file, fileList)
      this.fileList = [...fileList]
    },
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        return false
      }
      return true
    }
  }
}
</script>
<style lang='scss' scoped>
.disabled {
  ::v-deep {
    .el-upload--picture-card {
      display: none;
    }
  }
}
</style>
