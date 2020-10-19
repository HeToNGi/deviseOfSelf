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

