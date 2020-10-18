create table medicine_order_item
(
    id                bigint auto_increment comment '主键'
        primary key,
    user_id           bigint         not null comment '用户ID',
    order_no          varchar(200)   null comment '订单编号',
    medicine_goods_no bigint         null comment '药品ID',
    medicine_price    decimal(10, 2) null comment '药品价格'
)
    comment '药品用户订单项表';

