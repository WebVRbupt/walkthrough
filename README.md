## 说明

### 一、数据库相关

1. h2访问
   url: jdbc:h2:file:{your_absolute_path}/h2/testdb
   name: vr
   password: vr123
2. 中间绝对路径需要自己配置
3. h2使用的是文件存储模式 在项目h2文件夹下
4. 数据库访问使用springJPA 只需要写Interface,它会自动生成查询语句

### 二、测试相关

1. 测试用户 name: vr password: vr123123

### 三、前端相关

#### 前端框架使用layui  https://www.layui.site/index.htm
#### 创建项目页面引入了 `React`  https://react.dev/  和前端组件库 `Antd` https://ant.design/

1. 用户登录后入口文件 project-manage.html
2. u-project-table.html 是用户数据表格，包括删除/预览/...
3. u-create-project.html 创建项目功能页面
4. stitch-panorama.html 全景图拼接功能页面
5. newSceneEdit.htm 可视化编辑功能页面
6. 前端页面不用起项目，直接用IDEA预览功能就行
7. 测试数据 demo1.json
8. 引入 `NanoID` 库 https://github.com/ai/nanoid 为全景漫游项目全景图和模型资源生成唯一标识id

#### 主要页面
登录
注册
用户项目管理
全景漫游制作（行走漫游+比例标定）
全景漫游浏览
全景图拼接

### 四、算法相关 
#### jep
```
嵌入Java的python解释器，用于支持测距功能

项目地址：https://github.com/ninia/jep

项目wiki:https://github.com/ninia/jep/wiki

无论操作系统如何，Jep都需要先安装JDK和Python的兼容版本，然后才能构建和运行。

**Linux下配置环境**

1. 通过maven引入

<dependency>
<groupId>black.ninia</groupId>
<artifactId>jep</artifactId>
<version>4.1.1</version>
</dependency>

2. python环境安装jep

pip install jep

3. 如果还是出错的话试着装一下python3-dev

**Windows下环境配置**

同上，然后需要去系统变量中配置**JDK_HOME**,**PYTHON_HOME**
如果需要调用的python脚本使用numpy报错的话，可以试着参考以下解答
https://stackoverflow.com/questions/36778066/importerror-dll-load-failed-when-importing-numpy-installed-in-conda-virtual-env
```



