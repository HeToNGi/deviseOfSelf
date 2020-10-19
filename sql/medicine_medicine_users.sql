create table medicine_users
(
    id            bigint auto_increment comment '主键'
        primary key,
    username      varchar(100) null comment '用户名',
    user_type     varchar(2)   null comment '用户类型 0-管理员 1-药店 2-用户',
    user_password varchar(200) null comment '用户密码',
    members_point int          null comment '用户积分'
)
    comment '用户表';

INSERT INTO medicine.medicine_users (id, username, user_type, user_password, members_point) VALUES (1, 'abc', '1', '123', 0);
INSERT INTO medicine.medicine_users (id, username, user_type, user_password, members_point) VALUES (2, 'admin', '0', '123', 0);
INSERT INTO medicine.medicine_users (id, username, user_type, user_password, members_point) VALUES (3, 'root', '0', '123', 0);
INSERT INTO medicine.medicine_users (id, username, user_type, user_password, members_point) VALUES (4, 'aa', '2', '11', 1000);
INSERT INTO medicine.medicine_users (id, username, user_type, user_password, members_point) VALUES (5, 'bb', '1', '11', 0);