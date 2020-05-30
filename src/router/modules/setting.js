/**
 * 系统设置 - 路由配置
 * @author LiQingSong
 */
import LayoutIndex from '@/layout/Index';

const settingRouter = {
    path: '/setting',
    component: LayoutIndex,
    redirect: '/setting/about',
    name: 'setting',
    meta: {
        title: '设置',
        icon: 'menu-setting',
        roles: ['setting']
    },
    children: [
        {
            path: 'about',
            component: () => import('@/views/Setting/about'),
            name: 'setting-about',
            meta: {  title: '关于我',   roles: ['setting-about'] }
        },
        {
            path: 'taglist',
            component: () => import('@/views/Setting/taglist'),
            name: 'setting-taglist',
            meta: {  title: '标签管理',   roles: ['setting-taglist'] }
        },        
        {
            path: 'accountlist',
            component: () => import('@/views/Setting/accountlist'),
            name: 'setting-accountlist',
            meta: {  title: '账号列表',   roles: ['setting-accountlist'] }
        },
        {
            path: 'rolelist',
            component: () => import('@/views/Setting/rolelist'),
            name: 'setting-rolelist',
            meta: {  title: '角色列表',   roles: ['setting-rolelist'] }
        },
        {
            path: 'menulist',
            component: () => import('@/views/Setting/menulist'),
            name: 'setting-menulist',
            meta: {  title: '后台菜单',   roles: ['setting-menulist'] }
        },
        {
            path: 'apilist',
            component: () => import('@/views/Setting/apilist'),
            name: 'setting-apilist',
            meta: {  title: '后台API',   roles: ['setting-apilist'] }
        },
        {
            path: 'siteconfig',
            component: () => import('@/views/Setting/siteconfig'),
            name: 'setting-siteconfig',
            meta: {  title: '站点配置',   roles: ['setting-siteconfig'] }
        }
    ]
};

export default settingRouter;