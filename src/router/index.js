import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../pages/Home.vue'
import Content from '../pages/common/Content'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../pages/login/Login')
  },
  {
    path: '',
    component: Content,
    meta: {
      title: '首页',
      enTitle: 'dashboard',
      icon: 'el-icon-s-home'
    },
    children: [
      {
        name: 'home',
        component: Home,
        path: '/home',
        meta: {
          path: '/home'
        }
      }
    ]
  },
  {
    path: '/goods',
    component: Content,
    meta: {
      title: '商品管理',
      enTitle: 'product',
      icon: 'el-icon-goods',
    },
    children: [
      {
        path: 'goods',
        name: 'goods',
        component: () => import('../pages/goods/Goods.vue'),
        meta: {
          title: '商品列表',
          enTitle: 'goods',
          icon: 'el-icon-help',
          path: '/goods/goods'
        }
      },
      {
        path: 'addGoods',
        name: 'addGoods',
        component: () => import('../pages/addGoods/AddGoods.vue'),
        meta: {
          title: '添加商品',
          enTitle: 'addGoods',
          icon: 'el-icon-help',
          path: '/goods/goods'
        }
      },
      {
        path: 'params',
        name: 'params',
        enTitle: 'params',
        component: () => import('../pages/params/Params.vue'),
        meta: {
          title: '分类参数',
          enTitle: 'params',
          icon: 'el-icon-bell',
          path: '/goods/params'
        }
      },
      {
        path: 'categories',
        name: 'categories',
        component: () => import('../pages/categories/Categories.vue'),
        meta: {
          title: '商品分类',
          enTitle: 'categories',
          icon: 'el-icon-date',
          path: '/goods/categories'
        }
      }
    ]
  },
  {
    path: '/orders',
    component: Content,
    meta: {
      title: '订单管理',
      enTitle: 'orders',
      icon: 'el-icon-s-order',
    },
    children: [
      {
        path: 'orders',
        name: 'orders',
        component: () => import('../pages/orders/Orders.vue'),
        meta: {
          title: '订单列表',
          enTitle: 'orders',
          icon: 'el-icon-folder-add',
          path: '/orders/orders'
        }
      }
    ]
  },
  {
    path: '/rights',
    component: Content,
    meta: {
      title: '权限管理',
      enTitle: 'rights',
      icon: 'el-icon-folder'
    },
    children: [
      {
        path: 'roles',
        name: 'roles',
        component: () => import('../pages/roles/Roles.vue'),
        meta: {
          title: '角色列表',
          enTitle: 'roles',
          icon: 'el-icon-setting',
          path: '/rights/roles'
        }
      },
      {
        path: 'rights',
        name: 'rights',
        component: () => import('../pages/rights/Rights.vue'),
        meta: {
          title: '权限列表',
          enTitle: 'rights',
          icon: 'el-icon-c-scale-to-original',
          path: '/rights/rights'
        }
      }
    ]
  },
  {
    path: '/users',
    component: Content,
    meta: {
      title: '用户管理',
      enTitle: 'rights',
      icon: 'el-icon-user',
    },
    children: [
      {
        path: 'users',
        name: 'users',
        component: () => import('../pages/users/Users.vue'),
        meta: {
          title: '用户列表',
          enTitle: 'users',
          icon: 'el-icon-folder-opened',
          path: '/users/users'
        }
      }
    ]
  },
  {
    path: '/reports',
    component: Content,
    meta: {
      title: '数据统计',
      enTitle: 'reports',
      icon: 'el-icon-message'
    },
    children: [
      {
        path: 'reports',
        name: 'reports',
        component: () => import('../pages/reports/Reports.vue'),
        meta: {
          title: '数据报表',
          enTitle: 'reports',
          icon: 'el-icon-position',
          path: '/reports/reports'
        }
      }
    ]
  },
  {
    path: '*',
    component: Content,
    meta: {
      title: '错误页面'
    },
    children: [
      {
        path: '',
        component: () => import('../pages/err/404.vue')
      }
    ]
  }
]

const isPro = process.env.NODE_ENV === 'production'


const router = new VueRouter({
  mode: isPro ? 'hash' : 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  let user = localStorage.getItem('adminUser')
  if (to.path === '/login') {
    next()
  } else {
    user ? next() : next('/login')
  }
})

export default router
