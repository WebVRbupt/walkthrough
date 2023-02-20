CREATE TABLE if not exists users(
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL
);
create table projects
(
    project_id   INTEGER not null primary key,
    project_name VARCHAR not null,
    project_path varchar not null,
    user_id      INTEGER not null,
    foreign key (user_id) references USERS(USER_ID)
);
comment on table projects is '项目信息';
