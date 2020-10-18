create table medicine_order
(
    id               bigint auto_increment comment '主键'
        primary key,
    user_id          bigint        not null comment '下单用户ID',
    order_no         varchar(200)  null comment '订单编号',
    pay_type         varchar(3)    null comment '支付方式 1-医保卡 2-网上支付',
    has_pay          varchar(3)    null comment '支付状态 1-已支付 2-未支付',
    pickup_code      decimal       null comment '取件码',
    order_price      decimal       null comment '订单总价',
    create_date      varchar(25)   null comment '订单创建时间',
    has_pickup       varchar(2)    null comment '是否取药 0-否1-是',
    medicine_shop_id int           null comment '药店ID',
    order_address    varchar(1000) null comment '订单地址'
)
    comment '药品用户订单表';

