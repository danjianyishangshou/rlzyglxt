<template>
  <!-- 如果你用这个组件，有两个属性要理解
before-upload提供校验函数只有在校验通过以后才能继续上传
on-success提供成功函数可以在形参中拿到所有的结果 -->
  <!-- 非必传 -->
  <div class="upload-excel">
    <div class="btn-upload">
      <el-button :loading="loading" size="mini" type="primary" @click="handleUpload">
        点击上传
      </el-button>
    </div>

    <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="handleClick">
    <!-- 拖拽的盒子 -->
    <!-- drop拖拽了一个文件进入盒子范围了且松手了，才会触发drop!!! -->
    <div class="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
      <i class="el-icon-upload" />
      <span>将文件拖到此处</span>
    </div>
  </div>
</template>

<script>
import * as XLSX from 'xlsx'

export default {
  props: {
    beforeUpload: Function, // eslint-disable-line
    onSuccess: Function// eslint-disable-line
  },
  data() {
    return {
      loading: false,
      excelData: {
        header: null,
        results: null
      }
    }
  },
  methods: {
    generateData({ header, results }) {
      this.excelData.header = header
      this.excelData.results = results
      this.onSuccess && this.onSuccess(this.excelData)
    },
    handleDrop(e) {
      e.stopPropagation()
      e.preventDefault()
      if (this.loading) return
      // 拖拽了一个文件进入盒子，为了实现文件的上传=>拿到拖拽进来的文件们=>e.dataTransfer.files
      const files = e.dataTransfer.files
      // 你拖拽的文件不是1个，提示你+直接结束
      if (files.length !== 1) {
        this.$message.error('只支持上传一个文件！')
        return
      }
      // 你拖拽的文件就是1个=>文件组成的数组
      const rawFile = files[0] // only use files[0]
      // 不符合正则校验退出
      if (!this.isExcel(rawFile)) {
        this.$message.error('只能上传 .xlsx, .xls, .csv 后缀的文件')
        return false
      }
      this.upload(rawFile)
      // 浏览器兼容问题
      e.stopPropagation()
      e.preventDefault()
    },
    handleDragover(e) {
      // 浏览器兼容问题
      e.stopPropagation()
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    },
    handleUpload() {
      this.$refs['excel-upload-input'].click()
    },
    handleClick(e) {
      const files = e.target.files
      const rawFile = files[0] // only use files[0]
      if (!rawFile) return
      this.upload(rawFile)
    },
    upload(rawFile) {
      this.$refs['excel-upload-input'].value = null // fix can't select the same excel

      if (!this.beforeUpload) {
        // 表示你没有检验函数，此时说明你不需要校验，直接解读文件即可
        this.readerData(rawFile)
        return
      }
      // 表示你传了校验函数，直接调用你的校验函数=>校验结果=>true通过false失败
      const before = this.beforeUpload(rawFile)
      if (before) {
        // 通过 文件上传
        this.readerData(rawFile)
      }
      // 总结：将来如果真的开始解读解析文件了
      // 1.你没传检验函数，直接解读文件即可；
      // 2.你传了校验函数，必须在检验通过以后，才会开始解读文件
    },
    // 真正解读的文件
    readerData(rawFile) {
      this.loading = true
      // 读取文件这个操作耗时=>异步的操作！！！将来在文件读取结束以后，我们要做其他的事=>回调/封装promise
      return new Promise((resolve, reject) => {
        // FileReader是h5新出的一个用于读取文件的api
        const reader = new FileReader()
        reader.onload = e => {
          const data = e.target.result
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          const header = this.getHeaderRow(worksheet)
          const results = XLSX.utils.sheet_to_json(worksheet)
          this.generateData({ header, results })
          this.loading = false
          resolve()
        }
        reader.readAsArrayBuffer(rawFile)
      })
    },
    getHeaderRow(sheet) {
      const headers = []
      const range = XLSX.utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
        /* find the cell in the first row */
        let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        headers.push(hdr)
      }
      return headers
    },
    // 正则校验
    isExcel(file) {
      return /\.(xlsx|xls|csv)$/.test(file.name)
    }
  }
}
</script>

<style scoped lang="scss">
.upload-excel {
  display: flex;
  justify-content: center;
  margin-top: 100px;
  .excel-upload-input {
    display: none;
    z-index: -9999;
  }
  .btn-upload,
  .drop {
    border: 1px dashed #bbb;
    width: 350px;
    height: 160px;
    text-align: center;
    line-height: 160px;
  }
  .drop {
    padding-top: 20px;
    line-height: 80px;
    color: #bbb;
    i {
      font-size: 60px;
      display: block;
    }
  }
}
</style>
