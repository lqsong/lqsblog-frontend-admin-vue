/**
 * 文章 - 路由配置
 * @author LiQingSong
 */
import LayoutIndex from '@/layout/Index';

const articleRouter = {
    path: '/article',
    component: LayoutIndex,
    redirect: '/article/list',
    name: 'article',
    meta: {
        title: '随笔管理',
        icon: 'menu-article',
        roles: ['article']
    },
    children: [
        {
            path: 'list',
            component: () => import('@/views/Article/list'),
            name: 'article-list',
            meta: {  title: '随笔列表',   roles: ['article-list'] }
        },
        {
            path: 'add',
            hidden: true,
            component: () => import('@/views/Article/add'),
            name: 'article-add',
            meta: {  title: '随笔新增',   roles: ['article-add'], activeMenu: '/article/list' }
        },
        {
            path: 'edit-:id',
            hidden: true,
            component: () => import('@/views/Article/edit'),
            name: 'article-edit',
            meta: {  title: '随笔修改',   roles: ['article-edit'], activeMenu: '/article/list' }
        },
        {
            path: 'category',
            component: () => import('@/views/Article/category'),
            name: 'article-category',
            meta: {  title: '随笔分类',   roles: ['article-category'] }
        }
    ]
};

export default articleRouter;