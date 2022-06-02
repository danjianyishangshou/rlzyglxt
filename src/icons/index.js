import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// 全局注册组件
/* <svg-icon></svg-icon> 也是svg的一种使用方式*/

Vue.component('svg-icon', SvgIcon)

// require.context(directory, useSubdirectories, regExp)
// require.context是个函数，是为了实现自动导入不希望手动import因为文件太多，import不过来
// 1.要查找的文件路径
// 2.是否查找子目录
// 3。要匹配的文件的正则

const req = require.context('./svg', false, /\.svg$/)
// 将来通过这个方法获取到了要查找的所有文件的路径的集合
// console.log(req.keys())

// 通过上面获取到的文件路径的集合，批量导入所有的文件
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

