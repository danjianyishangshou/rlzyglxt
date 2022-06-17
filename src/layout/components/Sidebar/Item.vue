<script>
// 一个组件必须要有结构，提供结构
// 1.通过.vue文件中的template提供结构
// 2.通过render函数，这个函数的返回值就是组件的结构
export default {
  name: 'MenuItem',
  functional: true,
  // 接收了icon与title
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  // 提供结构的函数render

  // 注意render函数没有this
  render(h, context) {
    // render函数获取pops,可以通过函数的第二个参数context获取
    // this.title 等于 context.props.title
    // this.icon 等于 context.props.icon
    const { icon, title } = context.props
    const vnodes = []

    if (icon) {
      // 判断图标是否含有element中的图标 有直接渲染
      if (icon.includes('el-icon')) {
        // 渲染的ele的图标
        vnodes.push(<i class={[icon, 'sub-el-icon']} />)
      } else {
        // 渲染成我这个项目自己的图标=>svg图标=>封装成组件svg-icon
        vnodes.push(<svg-icon icon-class={icon}/>)
      }
    }

    if (title) {
      // 这里提供结构的方式类似于react中的jsx语法
      vnodes.push(<span slot='title'>{(title)}</span>)
    }
    return vnodes
  }
}
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
