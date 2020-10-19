create table medicine_order
(
    id               bigint auto_increment comment '主键'
        primary key,
    user_id          bigint         not null comment '下单用户ID',
    order_no         varchar(200)   null comment '订单编号',
    pay_type         varchar(3)     null comment '支付方式 1-医保卡 2-网上支付',
    has_pay          varchar(3)     null comment '支付状态 1-已支付 2-未支付',
    has_pickup       varchar(2)     null comment '是否取药或者发货 0-否1-是',
    create_date      varchar(25)    null comment '订单创建时间',
    order_price      decimal(10, 2) null comment '订单总价',
    medicine_shop_id int            null comment '药店ID',
    order_address    varchar(1000)  null comment '订单地址'
)
    comment '药品用户订单表';

INSERT INTO medicine.medicine_order (id, user_id, order_no, pay_type, has_pay, has_pickup, create_date, order_price, medicine_shop_id, order_address) VALUES (14, 4, '049c84f4-660e-48a6-80b0-1382e2580261', '1', '1', '0', '2020-10-19 13:47:29', 5.00, 1, '');
INSERT INTO medicine.medicine_order (id, user_id, order_no, pay_type, has_pay, has_pickup, create_date, order_price, medicine_shop_id, order_address) VALUES (15, 4, 'c690a5f1-a3f6-464f-ae41-6ce3f3e41231', '1', '1', '0', '2020-10-19 13:47:29', 16.00, 13, '');
INSERT INTO medicine.medicine_order (id, user_id, order_no, pay_type, has_pay, has_pickup, create_date, order_price, medicine_shop_id, order_address) VALUES (16, 4, '76b15a9d-7658-4076-bae3-49fdef3b238f', '1', '1', '0', '2020-10-19 13:50:35', 12.00, 1, '');
INSERT INTO medicine.medicine_order (id, user_id, order_no, pay_type, has_pay, has_pickup, create_date, order_price, medicine_shop_id, order_address) VALUES (17, 4, '8bfe26c6-302f-4142-94d0-72ff02f40ee2', '1', '1', '0', '2020-10-19 13:52:23', 5.20, 1, '');
INSERT INTO medicine.medicine_order (id, user_id, order_no, pay_type, has_pay, has_pickup, create_date, order_price, medicine_shop_id, order_address) VALUES (18, 4, '92db0737-6a03-43ea-b3bd-57856e0e2ca3', '2', '2', '0', '2020-10-19 13:55:56', 15.60, 13, '北京市颐和园');
INSERT INTO medicine.medicine_order (id, user_id, order_no, pay_type, has_pay, has_pickup, create_date, order_price, medicine_shop_id, order_address) VALUES (19, 4, 'd74g4zw3ho', '1', '1', '0', '2020-10-19 15:28:27', 10.40, 1, '');
INSERT INTO medicine.medicine_order (id, user_id, order_no, pay_type, has_pay, has_pickup, create_date, order_price, medicine_shop_id, order_address) VALUES (20, 4, '737mc3860n', '1', '1', '0', '2020-10-19 15:28:27', 15.60, 13, '');
INSERT INTO medicine.medicine_order (id, user_id, order_no, pay_type, has_pay, has_pickup, create_date, order_price, medicine_shop_id, order_address) VALUES (21, 4, 'pkslhsgf5y', '1', '1', '1', '2020-10-19 15:33:22', 17.20, 1, '');
INSERT INTO medicine.medicine_order (id, user_id, order_no, pay_type, has_pay, has_pickup, create_date, order_price, medicine_shop_id, order_address) VALUES (22, 4, 'rebel4dd4x', '2', '2', '0', '2020-10-19 16:04:46', 78.00, 13, '广东省深圳市南山区');
INSERT INTO medicine.medicine_order (id, user_id, order_no, pay_type, has_pay, has_pickup, create_date, order_price, medicine_shop_id, order_address) VALUES (23, 4, 'tv4ud6kq4i', '2', '1', '1', '2020-10-19 16:05:14', 31.20, 1, '广东省深圳市福田区');