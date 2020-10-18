create table medicine_users_verified
(
    id        bigint auto_increment comment '主键'
        primary key,
    username  varchar(100) null comment '用户名',
    user_id   bigint       null comment '用户ID',
    card_type varchar(20)  null comment '证件类型',
    card_num  varchar(20)  null comment '身份证号'
)
    comment '用户实名认证信息表';

INSERT INTO medicine.medicine_users_verified (id, username, user_id, card_type, card_num) VALUES (1, 'aa', 4, '身份证', '12345');