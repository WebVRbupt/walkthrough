## 说明
### h2访问
    url: jdbc:h2:file:{your_absolute_path}/h2/testdb
    name: vr
    password: vr123
1. 中间绝对路径需要自己配置
2. h2使用的是文件存储模式 在项目h2文件夹下
### 数据库访问使用springJPA 只需要写Interface,它会自动生成查询语句