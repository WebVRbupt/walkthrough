## 说明
### h2访问
    url: jdbc:h2:file:{your_absolute_path}/h2/testdb
    name: vr
    password: vr123
1. 中间绝对路径需要自己配置
2. h2使用的是文件存储模式 在项目h2文件夹下
### 数据库访问使用springJPA 只需要写Interface,它会自动生成查询语句

### 前端框架使用layui  https://www.layui.site/index.htm
1. 用户登录后入口文件 project-manage.html
2. u-project-table.html 是用户数据表格，包括删除/预览/...
3. 前端页面不用起项目，直接用IDEA预览功能就行
4. 测试数据 demo1.json

### 主要页面
 登录
 注册
 用户项目管理
 全景漫游制作（行走漫游+比例标定）
 全景漫游浏览
 全景图拼接