create table medicine_car
(
    id                bigint auto_increment comment '主键'
        primary key,
    user_name         varchar(200)   not null comment '用户ID',
    medicine_goods_no varchar(200)   null comment '药品ID',
    medicine_price    decimal(10, 2) null comment '药品价格',
    medicine_num      decimal        null comment '购物车数量'
)
    comment '购物车表';

INSERT INTO medicine.medicine_car (id, user_name, medicine_goods_no, medicine_price, medicine_num) VALUES (9, 'aa', '7880d4c4-c416-4517-9d4d-4272d8de9352', 15.60, 3);
INSERT INTO medicine.medicine_car (id, user_name, medicine_goods_no, medicine_price, medicine_num) VALUES (10, 'aa', '732270d2-62e9-4334-b56f-90fb470939ae', 15.60, 1);
INSERT INTO medicine.medicine_car (id, user_name, medicine_goods_no, medicine_price, medicine_num) VALUES (11, 'aa', '3ac37ccc-d96a-4dc8-9918-932449a4f445', 24.00, 2);