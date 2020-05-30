/**
 * 左邻右舍 - 路由配置
 * @author LiQingSong
 */
import LayoutIndex from '@/layout/Index';

const linksRouter = {
    path: '/links',
    component: LayoutIndex,
    redirect: '/links/list',
    name: 'links',
    meta: {
        title: '左邻右舍',
        icon: 'menu-links',
        roles: ['links']
    },
    children: [
        {
            path: 'list',
            component: () => import('@/views/Links/list'),
            name: 'links-list',
            meta: {  title: '链接列表',   roles: ['links-list'] }
        },
        {
            path: 'category',
            component: () => import('@/views/Links/category'),
            name: 'links-category',
            meta: {  title: '链接分类',   roles: ['links-category'] }
        }
    ]
};

export default linksRouter;