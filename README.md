# lqsblog-frontend-admin-vue

 它（[Github](https://github.com/lqsong/lqsblog-frontend-admin-vue) 、 [Gitee](https://gitee.com/lqsong/lqsblog-frontend-admin-vue)）是一个ADMIN管理后台，它基于 [admin-element-vue](http://admin-element-vue.liqingsong.cc/)框架的javascript.v1版本实现。


## 开发文档

- [DEMO](http://lqsblog-demo.admin-element-vue.liqingsong.cc/)

- [lqsBlog官方文档](http://docs.liqingsong.cc/)。

- [admin-element-vue官方文档](http://admin-element-vue.liqingsong.cc/)。

## 功能

```
- 登录 / 注销
- 首页 / 统计
- 随笔管理
  - 随笔列表
    - 随笔添加
    - 随笔编辑
    - 随笔删除
  - 随笔分类
    - 随笔分类添加
    - 随笔分类编辑
    - 随笔分类删除
- 作品管理
  - 作品列表
    - 作品添加
    - 作品编辑
    - 作品删除
- 专题管理
  - 专题列表
    - 专题添加
    - 专题编辑
    - 专题删除
- 左邻右舍
  - 链接列表
    - 链接添加
    - 链接编辑
    - 链接删除
  - 链接分类
    - 链接笔分类添加
    - 链接分类编辑
    - 链接分类删除
    - 链接分类排序
- 设置
  - 关于我
  - 标签管理
    - 标签添加
    - 标签编辑
    - 标签删除
  - 账号列表
    - 账号添加
    - 账号编辑
    - 账号删除
    - 账号权限角色
  - 角色列表
    - 角色添加
    - 角色编辑
    - 角色删除
    - 角色菜单权限
  - 后台菜单
    - 菜单添加
    - 菜单编辑
    - 菜单删除
    - 菜单后端API权限
  - 后台API
   - 后台API添加
   - 后台API编辑
   - 后台API删除
  - 站点配置
```

## 界面展示

![index](https://gitee.com/lqsong/lqsblog/raw/master/images/lqsblog-frontend-admin-vue/index.png) 
![set-adminapi](https://gitee.com/lqsong/lqsblog/raw/master/images/lqsblog-frontend-admin-vue/set-adminapi.png) 
![set-adminmenu](https://gitee.com/lqsong/lqsblog/raw/master/images/lqsblog-frontend-admin-vue/set-adminmenu.png) 
![set-adminmenu2](https://gitee.com/lqsong/lqsblog/raw/master/images/lqsblog-frontend-admin-vue/set-adminmenu2.png) 
![set-role](https://gitee.com/lqsong/lqsblog/raw/master/images/lqsblog-frontend-admin-vue/set-role.png) 
![set-account](https://gitee.com/lqsong/lqsblog/raw/master/images/lqsblog-frontend-admin-vue/set-account.png) 



## 自定义配置

### 一、**(必须)** 复制 'vue.config.default.js' 重命名为 ' vue.config.js'
查看 [配置参考](https://cli.vuejs.org/config/).

### 二、**(必须)**  复制 'src/main.ext.default.js' 重命名为 'src/main.ext.js'
满足不同用户、不同环境下，内容可自定义进行增删减

### 三、**(建议)** 开发模式下，不要直接修改 '.env.development'
复制 '.env.development' 重命名为 ' .env.development.local' , 修改对应的参数.

### 四、**(建议)** 生产模式下，不要直接修改 '.env.production'
复制 '.env.production' 重命名为 ' .env.production.local' , 修改对应的参数.

## 项目设置
```
npm install
```

### 一、Compiles and hot-reloads for development
```
npm run serve
```

### 二、Compiles and minifies for production
```
npm run build
```

### 三、运行单元测试
```
npm run test:unit
```

### 四、运行端到端测试
```
npm run test:e2e
```

### 五、修复
```
npm run lint
```

### 六、精简 svg icon
```
npm run svgo
```

## 捐赠

如果你觉得这个项目帮助到了你，你可以请作者喝咖啡表示鼓励.

**ALIPAY**             |  **WECHAT**
:-------------------------:|:-------------------------:
![Alipay](http://uploads.liqingsong.cc/20210430/f62d2436-8d92-407d-977f-35f1e4b891fc.png)  |  ![Wechat](http://uploads.liqingsong.cc/20210430/3e24efa9-8e79-4606-9bd9-8215ce1235ac.png)

