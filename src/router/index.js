import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  /**
   * 统计管理模块
   */
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '塑胶',
    // hidden: true,
    children: [{
      path: 'dashboard',
      name: '统计分析',
      meta: { title: '统计分析', icon: 'form' },
      component: () => import('@/views/dashboard/index')
    }]
  },

  /*讲师模块*/
  {
    path: '/teacher',
    component: Layout,
    redirect: '/teacher/list',
    name: '讲师管理',
    meta: { title: '讲师管理', icon: 'user' },
    children: [
      {
        path: 'list',
        name: '讲师列表',
        component: () => import('@/views/edu/teacher/index'),
        meta: { title: '讲师列表', icon: 'user' }
      },
      {
        path: 'save',
        name: '添加讲师',
        component: () => import('@/views/edu/addorUpdateTeacher/index'),
        meta: { title: '添加讲师', icon: 'tree' }
      },
      {
        path: 'update/:id',
        name: '更新讲师',
        component: () => import('@/views/edu/addorUpdateTeacher/index'),
        meta: { title: '更新讲师', icon: 'tree' },
        hidden:true
      }
    ]
  },

  //课程分类模块
  {
    path: '/subject',
    component: Layout,
    redirect: '/subject/import',
    name: '分类管理',
    meta: { title: '分类管理', icon: 'example' },
    children: [
      {
        path: 'list',
        name: '课程分类管理',
        component: () => import('@/views/edu/subject/index'),
        meta: { title: '课程分类管理', icon: 'table' }
      },
      {
        path: 'import',
        name: '添加分类',
        component: () => import('@/views/edu/importSubject/index'),
        meta: { title: '添加分类', icon: 'tree' }
      }
    ]
  },

  //课程模块
  {
    path: '/course',
    component: Layout,
    redirect: '/course/list',
    name: '课程管理',
    meta: { title: '课程管理', icon: 'example' },
    children: [
      {
        path: 'list',
        name: '课程列表',
        component: () => import('@/views/edu/course/index'),
        meta: { title: '课程列表', icon: 'table' }
      },
      {
        path: 'save',
        name: '添加课程',
        component: () => import('@/views/edu/addorUpdatecourse/index_1'),
        meta: { title: '添加课程', icon: 'tree' }
      },

      //以下路由跳转 不显示
      {
        path: 'index_1/:id',
        name: '添加课程',
        component: () => import('@/views/edu/addorUpdatecourse/index_1'),
        meta: { title: '添加课程', icon: 'tree' },
        hidden:true
      },
      {
        path: 'index_2/:id',
        name: '添加课程',
        component: () => import('@/views/edu/addorUpdatecourse/index_2'),
        meta: { title: '添加课程', icon: 'tree' },
        hidden:true
      },
      {
        path: 'index_3/:id',
        name: '添加课程',
        component: () => import('@/views/edu/addorUpdatecourse/index_3'),
        meta: { title: '添加课程', icon: 'tree' },
        hidden:true
      }
    ]
  },


]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
