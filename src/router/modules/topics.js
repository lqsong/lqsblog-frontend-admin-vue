/**
 * 专题 - 路由配置
 * @author LiQingSong
 */
import LayoutIndex from '@/layout/Index';

const topicsRouter = {
    path: '/topics',
    component: LayoutIndex,
    redirect: '/topics/list',
    name: 'topics',
    meta: {
        title: '专题管理',
        icon: 'menu-topics',
        roles: ['topics']
    },
    children: [
        {
            path: 'list',
            component: () => import('@/views/Topics/list'),
            name: 'topics-list',
            meta: {  title: '专题列表',   roles: ['topics-list'] }
        },
        {
            path: 'add',
            hidden: true,
            component: () => import('@/views/Topics/add'),
            name: 'topics-add',
            meta: {  title: '专题新增',   roles: ['topics-add'], activeMenu: '/topics/list' }
        },
        {
            path: 'edit-:id',
            hidden: true,
            component: () => import('@/views/Topics/edit'),
            name: 'topics-edit',
            meta: {  title: '专题修改',   roles: ['topics-edit'], activeMenu: '/topics/list' }
        }
    ]
};

export default topicsRouter;