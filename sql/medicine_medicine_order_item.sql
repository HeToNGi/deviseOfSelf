create table medicine_order_item
(
    id                bigint auto_increment comment '主键'
        primary key,
    user_id           bigint         not null comment '用户ID',
    order_no          varchar(200)   null comment '订单编号',
    medicine_goods_no varchar(200)   null comment '药品ID',
    medicine_price    decimal(10, 2) null comment '药品价格',
    medicine_num      decimal        null comment '购买数量'
)
    comment '药品用户订单项表';

INSERT INTO medicine.medicine_order_item (id, user_id, order_no, medicine_goods_no, medicine_price, medicine_num) VALUES (18, 4, '049c84f4-660e-48a6-80b0-1382e2580261', '7880d4c4-c416-4517-9d4d-4272d8de9352', 5.20, 1);
INSERT INTO medicine.medicine_order_item (id, user_id, order_no, medicine_goods_no, medicine_price, medicine_num) VALUES (19, 4, 'c690a5f1-a3f6-464f-ae41-6ce3f3e41231', '732270d2-62e9-4334-b56f-90fb470939ae', 15.60, 1);
INSERT INTO medicine.medicine_order_item (id, user_id, order_no, medicine_goods_no, medicine_price, medicine_num) VALUES (20, 4, '76b15a9d-7658-4076-bae3-49fdef3b238f', '3ac37ccc-d96a-4dc8-9918-932449a4f445', 12.00, 1);
INSERT INTO medicine.medicine_order_item (id, user_id, order_no, medicine_goods_no, medicine_price, medicine_num) VALUES (21, 4, '8bfe26c6-302f-4142-94d0-72ff02f40ee2', '7880d4c4-c416-4517-9d4d-4272d8de9352', 5.20, 1);
INSERT INTO medicine.medicine_order_item (id, user_id, order_no, medicine_goods_no, medicine_price, medicine_num) VALUES (22, 4, '92db0737-6a03-43ea-b3bd-57856e0e2ca3', '732270d2-62e9-4334-b56f-90fb470939ae', 15.60, 1);
INSERT INTO medicine.medicine_order_item (id, user_id, order_no, medicine_goods_no, medicine_price, medicine_num) VALUES (23, 4, 'd74g4zw3ho', '7880d4c4-c416-4517-9d4d-4272d8de9352', 10.40, 2);
INSERT INTO medicine.medicine_order_item (id, user_id, order_no, medicine_goods_no, medicine_price, medicine_num) VALUES (24, 4, '737mc3860n', '732270d2-62e9-4334-b56f-90fb470939ae', 15.60, 1);
INSERT INTO medicine.medicine_order_item (id, user_id, order_no, medicine_goods_no, medicine_price, medicine_num) VALUES (25, 4, 'pkslhsgf5y', '7880d4c4-c416-4517-9d4d-4272d8de9352', 5.20, 1);
INSERT INTO medicine.medicine_order_item (id, user_id, order_no, medicine_goods_no, medicine_price, medicine_num) VALUES (26, 4, 'pkslhsgf5y', '3ac37ccc-d96a-4dc8-9918-932449a4f445', 12.00, 1);
INSERT INTO medicine.medicine_order_item (id, user_id, order_no, medicine_goods_no, medicine_price, medicine_num) VALUES (27, 4, 'rebel4dd4x', '732270d2-62e9-4334-b56f-90fb470939ae', 78.00, 5);
INSERT INTO medicine.medicine_order_item (id, user_id, order_no, medicine_goods_no, medicine_price, medicine_num) VALUES (28, 4, 'tv4ud6kq4i', '7880d4c4-c416-4517-9d4d-4272d8de9352', 31.20, 6);