const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  staffPhoto: state => state.user.userInfo.staffPhoto,
  name: state => state.user.userInfo.username,
  routes: state => state.permission.routes,
  roles: state => state.user.userInfo.roles
}
export default getters
