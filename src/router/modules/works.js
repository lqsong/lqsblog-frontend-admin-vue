/**
 * 作品 - 路由配置
 * @author LiQingSong
 */
import LayoutIndex from '@/layout/Index';

const worksRouter = {
    path: '/works',
    component: LayoutIndex,
    redirect: '/works/list',
    name: 'works',
    meta: {
        title: '作品管理',
        icon: 'menu-works',
        roles: ['works']
    },
    children: [
        {
            path: 'list',
            component: () => import('@/views/Works/list'),
            name: 'works-list',
            meta: {  title: '作品列表',   roles: ['works-list'] }
        },
        {
            path: 'add',
            hidden: true,
            component: () => import('@/views/Works/add'),
            name: 'works-add',
            meta: {  title: '作品新增',   roles: ['works-add'], activeMenu: '/works/list' }
        },
        {
            path: 'edit-:id',
            hidden: true,
            component: () => import('@/views/Works/edit'),
            name: 'works-edit',
            meta: {  title: '作品修改',   roles: ['works-edit'], activeMenu: '/works/list' }
        }
    ]
};

export default worksRouter;