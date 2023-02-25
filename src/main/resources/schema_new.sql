create table users
(
    user_id INT auto_increment primary key,
    phone        varchar(20)            default ''                    not null comment '手机号，登录账号',
    openid       varchar(32)            default ''                    not null comment '微信登录openid',
    user_name     varchar(20)            default ''                    not null comment '昵称',
    password     varchar(32)            default ''                    not null comment '密码',
    level        smallint unsigned      default '1'                   not null comment '用户组',
    limit_num    smallint unsigned      default '0'                   not null comment '可发布项目数量限制，默认为0，无限制',
    create_time  timestamp              default CURRENT_TIMESTAMP     not null comment '注册（管理员添加）时间',
    last_time    timestamp              default '0000-00-00 00:00:00' not null comment '最近登录',
    status        tinyint unsigned       default '0'                   null comment '用户是否被禁用  0 正常 1禁用',
    amount       decimal(8, 2) unsigned default 0.00                  not null comment '账户余额'
)
    comment '用户表信息';
create table projects
(
    project_id int auto_increment
        primary key,
    user_id int  not null comment '用户id',
    project_name                varchar(255)                 null,
    project_path    varchar(100) not null comment  '项目路径',
    profile             text                         null comment '场景简介',
    thumb_path          varchar(255)                 not null comment '缩略图',
    pk_atlas_main       int                          not null comment '类别',
    view_uuid           varchar(16)                  not null comment '唯一标识符',
    creation_time       date                     not null comment '项目创建时间',
    privacy_flag        tinyint(1)       default 0   not null comment '是否设置为公开浏览 0 公开  1私有',
    privacy_password    varchar(32)                  null comment '私有密码',
    flag_publish        tinyint(1)       default 0   not null comment '是否发布作品',
    praised_num         int              default 0   not null comment '点赞',
    hideprofile_flag    tinyint(1)       default 0   not null comment '是否显示简介',
    hidepraise_flag     tinyint(1)       default 0   not null comment '是否允许点赞',
    create_time         datetime                     not null comment '生成时间',
    sort                smallint         default 999 not null comment '管理员定义的排序',
    recommend           tinyint(1)       default 0   not null comment '是否推荐 0 不推荐 1推荐',
    user_sort           smallint         default 999 not null comment '用户自定义显示排序',
    user_recommend      tinyint(1)       default 0   not null comment '用户自定义是否允许管理员推荐',
    flag_allowed_recomm tinyint(1)       default 1   not null comment '是事允许推荐',
    cdn_host            varchar(100)                 not null comment 'cdn服务器域名',
    constraint fk1 foreign key (user_id) references users(user_id)
)
    comment '全景项目作品表' charset = utf8mb3;
create table comments
(
    id            int auto_increment
        primary key,
    user_id int          not null comment '用户id',
    sname         varchar(100) not null comment '场景名称，用户评论的哪个场景，对应显示',
    content       varchar(255) not null comment '评论内容',
    head_img      varchar(255) not null comment '头像路径，存储在/data/avatar',
    nickname      varchar(100) not null comment '微信昵称',
    sex           varchar(10)  not null comment '性别',
    add_time      datetime     not null comment '生成时间',
    constraint foreign key (user_id) references users(user_id)
)
    comment '评论内容表' charset = utf8mb3;
-- 站点配置表
-- auto-generated definition
create table site_config
(
    id        mediumint unsigned auto_increment
        primary key,
    parent_id varchar(32)  default '' not null comment '父级id，配置信息为一维数组时',
    name      varchar(32)  default '' not null comment '配置项',
    value     varchar(255) default '' not null comment '配置内容',
    constraint parent_id
        unique (parent_id, name)
)
    comment '站点配置表' engine = MyISAM
                         charset = utf8mb3;
create table user_level
(
    id         smallint unsigned auto_increment comment '组id，1为系统默认，不可删除'
        primary key,
    level_name varchar(15) default '' not null comment '用户组名称',
    privileges text                   not null comment '组权限'
)
    comment '用户组表' engine = MyISAM
                       charset = utf8mb3;
alter table users modify level smallint unsigned      default '1'                   not null comment '用户组';
alter table users add constraint fk foreign key (level) references user_level(id);
-- 异步切图时临时项目表
-- auto-generated definition
create table worksmain_async
(
    id           mediumint unsigned auto_increment
        primary key,
    user_id int    not null comment '发布者id',
    name         varchar(32)        default ''                not null comment '项目名称',
    thumb_path   varchar(125)       default ''                not null comment '项目封面',
    create_time  timestamp          default CURRENT_TIMESTAMP not null comment '发布时间',
    status       tinyint unsigned   default '0'               not null comment '发布状态，1为完成；为1时，该条记录应当被删除',
    note         varchar(64)        default ''                not null comment '发布失败的提示信息',
    constraint fk3 foreign key (user_id)references users(user_id)
)
    comment '异步切图时临时项目表' engine = MyISAM
                                   charset = utf8mb3;
alter table worksmain_async add constraint fk4 foreign key (user_id) references users(user_id);
alter table worksmain_async
    add constraint worksmain_async_users_user_id_fk
        foreign key (user_id) references users (user_id);
