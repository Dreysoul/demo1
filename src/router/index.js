import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login'
import Index from '../components/index'
import Users from '../components/User/users'
import Roles from '../components/power/roles'
import Rights from '../components/power/rights'
import Goods from '../components/categories/goods'
import Params from '../components/categories/params'
import Categories from '../components/categories/categories'
import Orders from '../components/order/orders'
import Report from '../components/Report/report'
import welcome from '../views/welcome'
Vue.use(VueRouter)

const routes = [
  {path:'/',redirect:'/login'},
  {path:'/login',component:Login},
  {path:'/index',
    component:Index,
    redirect:'/welcome',
  // component可以用
  children:[
    {path:'/index',component:welcome},
    {path:'/users',component:Users},
    {path:'/roles',component:Roles},
    {path:'/rights',component:Rights},
    {path:'/goods',component:Goods},
    {path:'/params',component:Params},
    {path:'/categories',component:Categories},
    {path:'/orders',component:Orders},
    {path:'/reports',component:Report},
  ],
  },
  
]

const router = new VueRouter({
  routes
})

//登录token验证
// 为路由对象，添加 beforeEach 导航守卫
router.beforeEach((to, from, next) => {
  //to将要访问的路径
  //from代表从哪个路径跳转而来
  //next是一个函数，表示放行
  //next()放行 next('/login')强制跳转
  // 如果用户访问的登录页，直接放行
  if (to.path === '/login') return next()
  // 获取token，从 sessionStorage 中获取到 保存的 token 值
  const tokenStr = window.sessionStorage.getItem('token')
  // 没有token，强制跳转到登录页
  if (!tokenStr) return next('/login')
  next()
 })


export default router
