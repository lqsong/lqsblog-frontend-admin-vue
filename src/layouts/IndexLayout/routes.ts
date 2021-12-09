import settings from "@/config/settings";
import { RoutesDataItem } from "@/utils/routes";
import BlankLayout from '@/layouts/BlankLayout.vue';

const IndexLayoutRoutes: Array<RoutesDataItem> = [
  /*
  {
    title: 'index-layout.menu.home',
    path: '/home',
    component: ()=> import('@/views/home/index.vue')
  }, */
  {
    ...settings.homeRouteItem  
  },
  {
    icon: 'menu-article',    
    title: 'index-layout.menu.article',
    path: '/article',
    redirect: '/article/list',
    roles: ['article'],
    component: BlankLayout,    
    children: [
      {
        title: 'index-layout.menu.article.list',
        path: 'list',
        roles: ['article-list'],
        component: ()=> import('@/views/article/list/index.vue'),        
      },
      {
        hidden: true,
        title: 'index-layout.menu.article.add',
        path: 'add',
        roles: ['article-add'],
        component: () => import('@/views/article/add/index.vue'),
        selectLeftMenu: '/article/list'
      },
      {
        hidden: true,
        tabNavType: 'querypath',
        title: 'index-layout.menu.article.edit',
        path: 'edit',
        roles: ['article-edit'],
        component: () => import('@/views/article/edit/index.vue'),
        selectLeftMenu: '/article/list'
      },
      {
          title: 'index-layout.menu.article.category',
          path: 'category',
          roles: ['article-category'],
          component: () => import('@/views/article/category/index.vue'),
          
      }
    ]
  },
  {
    icon: 'menu-works',    
    title: 'index-layout.menu.works',
    path: '/works',
    redirect: '/works/list',
    roles: ['works'],
    component: BlankLayout,    
    children: [
      {
        title: 'index-layout.menu.works.list',
        path: 'list',
        roles: ['works-list'],
        component: ()=> import('@/views/works/list/index.vue'),        
      },
      {
        hidden: true,
        title: 'index-layout.menu.works.add',
        path: 'add',
        roles: ['works-add'],
        component: () => import('@/views/works/add/index.vue'),
        selectLeftMenu: '/works/list'
      },
      {
        hidden: true,
        tabNavType: 'querypath',
        title: 'index-layout.menu.works.edit',
        path: 'edit',
        roles: ['works-edit'],
        component: () => import('@/views/works/edit/index.vue'),
        selectLeftMenu: '/works/list'
      }
    ]
  },
  {
    icon: 'menu-topics',    
    title: 'index-layout.menu.topics',
    path: '/topics',
    redirect: '/topics/list',
    roles: ['topics'],
    component: BlankLayout,    
    children: [
      {
        title: 'index-layout.menu.topics.list',
        path: 'list',
        roles: ['topics-list'],
        component: ()=> import('@/views/topics/list/index.vue'),        
      },
      {
        hidden: true,
        title: 'index-layout.menu.topics.add',
        path: 'add',
        roles: ['topics-add'],
        component: () => import('@/views/topics/add/index.vue'),
        selectLeftMenu: '/topics/list'
      },
      {
        hidden: true,
        tabNavType: 'querypath',
        title: 'index-layout.menu.topics.edit',
        path: 'edit',
        roles: ['topics-edit'],
        component: () => import('@/views/topics/edit/index.vue'),
        selectLeftMenu: '/topics/list'
      }
    ]
  },
  {
    icon: 'menu-links',    
    title: 'index-layout.menu.links',
    path: '/links',
    redirect: '/links/list',
    roles: ['links'],
    component: BlankLayout,    
    children: [
      {
        title: 'index-layout.menu.links.list',
        path: 'list',
        roles: ['links-list'],
        component: ()=> import('@/views/links/list/index.vue'),        
      },
      {
        title: 'index-layout.menu.links.category',
        path: 'category',
        roles: ['links-category'],
        component: () => import('@/views/links/category/index.vue')
      }
      
    ]
  },
  {
    icon: 'set',    
    title: 'index-layout.menu.setting',
    path: '/setting',
    redirect: '/setting/about',
    roles: ['setting'],
    component: BlankLayout,    
    children: [
      {
        title: 'index-layout.menu.setting.about',
        path: 'about',
        roles: ['setting-about'],
        component: ()=> import('@/views/setting/about/index.vue'),        
      },
      {
        title: 'index-layout.menu.setting.taglist',
        path: 'taglist',
        roles: ['setting-taglist'],
        component: ()=> import('@/views/setting/taglist/index.vue'),        
      },
      {
        title: 'index-layout.menu.setting.accountlist',
        path: 'accountlist',
        roles: ['setting-accountlist'],
        component: ()=> import('@/views/setting/accountlist/index.vue'),        
      },
      {
        title: 'index-layout.menu.setting.rolelist',
        path: 'rolelist',
        roles: ['setting-rolelist'],
        component: ()=> import('@/views/setting/rolelist/index.vue'),        
      },
      {
        title: 'index-layout.menu.setting.menulist',
        path: 'menulist',
        roles: ['setting-menulist'],
        component: ()=> import('@/views/setting/menulist/index.vue'),        
      },
      {
        title: 'index-layout.menu.setting.apilist',
        path: 'apilist',
        roles: ['setting-apilist'],
        component: ()=> import('@/views/setting/apilist/index.vue'),        
      },
      {
        title: 'index-layout.menu.setting.siteconfig',
        path: 'siteconfig',
        roles: ['setting-siteconfig'],
        component: ()=> import('@/views/setting/siteconfig/index.vue'),        
      },
      
      
    ]
  },



];

export default IndexLayoutRoutes;