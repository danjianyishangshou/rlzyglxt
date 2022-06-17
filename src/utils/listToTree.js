// 递归将列表转成数组

/**
 * 列表转树形结构
 */
export const listToTree = (list, flag) => {
  // const oneList = list.map(item => {
  //   item.id === flag
  //   if (item.pid) {
  //     oneList.push(listToTree(list, item.id))
  //   }
  // })
  const arr = []
  list.forEach(item => {
    if (item.pid === flag) {
      const children = listToTree(list, item.id)
      if (children.length > 0) {
        item.children = children
      }
      arr.push(item)
    }
  })
  return arr
}

