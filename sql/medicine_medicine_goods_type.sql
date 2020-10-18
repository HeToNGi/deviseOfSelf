create table medicine_goods_type
(
    id                 bigint auto_increment comment '主键'
        primary key,
    user_id            bigint       not null comment '用户ID',
    medicine_type_name varchar(200) null comment '药品分类'
)
    comment '药品分类表';

INSERT INTO medicine.medicine_goods_type (id, user_id, medicine_type_name) VALUES (4, 1, '养生类');
INSERT INTO medicine.medicine_goods_type (id, user_id, medicine_type_name) VALUES (6, 1, '保健品');
INSERT INTO medicine.medicine_goods_type (id, user_id, medicine_type_name) VALUES (7, 1, '感冒药');
INSERT INTO medicine.medicine_goods_type (id, user_id, medicine_type_name) VALUES (8, 1, '中药');
INSERT INTO medicine.medicine_goods_type (id, user_id, medicine_type_name) VALUES (9, 1, '西药');
INSERT INTO medicine.medicine_goods_type (id, user_id, medicine_type_name) VALUES (11, 5, '注射类');
INSERT INTO medicine.medicine_goods_type (id, user_id, medicine_type_name) VALUES (15, 5, 'eee');
INSERT INTO medicine.medicine_goods_type (id, user_id, medicine_type_name) VALUES (16, 5, 'aa');