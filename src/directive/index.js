// 这样有两个不好，
// 1.限制死了用户的使用方式，想全局就全局，想局部就局部
// 2.限制死了用户一定要用，希望是用户想用的时候自己注册

// 注册自定义指令
// 可以全局注册，也可以在模块内注册
export const imgError = {
  inserted(el, binding) {
    el.onerror = function() {
      el.src = binding.value
    }
  }
}

export const focus = {
  inserted(el) {
    el.focus()
  }
}

export const color = {
  inserted(el, binding) {
    el.style.color = binding.value
  }
}
