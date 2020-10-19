create table medicine_goods
(
    id                     bigint auto_increment comment '主键'
        primary key,
    user_id                bigint         not null comment '用户ID',
    medicine_shop_id       bigint         not null comment '药店ID',
    medicine_goods_type_id bigint         not null comment '药品分类ID',
    medicine_no            varchar(200)   null comment '药品编码',
    medicine_name          varchar(200)   null comment '药品名称',
    medicine_desc          varchar(200)   null comment '药品描述',
    medicine_price         decimal(10, 2) null comment '药品价格',
    medicine_num           decimal        null comment '药品库存',
    medicine_pic_url       varchar(200)   null comment '药品图片地址',
    create_date            varchar(25)    null comment '上架时间',
    is_delete              varchar(2)     null comment '删除 0-否 1-是'
)
    comment '药品表';

INSERT INTO medicine.medicine_goods (id, user_id, medicine_shop_id, medicine_goods_type_id, medicine_no, medicine_name, medicine_desc, medicine_price, medicine_num, medicine_pic_url, create_date, is_delete) VALUES (1, 1, 1, 7, '3ac37ccc-d96a-4dc8-9918-932449a4f445', '999感冒灵', '特效感冒药', 12.00, 98, '/images/upload_d4b7e65fa0200a78260740b92a7bd56b.jpg', '2020-10-17', '0');
INSERT INTO medicine.medicine_goods (id, user_id, medicine_shop_id, medicine_goods_type_id, medicine_no, medicine_name, medicine_desc, medicine_price, medicine_num, medicine_pic_url, create_date, is_delete) VALUES (30, 1, 1, 9, '7880d4c4-c416-4517-9d4d-4272d8de9352', '甘草片', '咳嗽', 5.20, 89, '/images/upload_404b138861dbc67fd4950f8a2dcfc586.jpg', '2020-10-18', '0');
INSERT INTO medicine.medicine_goods (id, user_id, medicine_shop_id, medicine_goods_type_id, medicine_no, medicine_name, medicine_desc, medicine_price, medicine_num, medicine_pic_url, create_date, is_delete) VALUES (31, 5, 13, 11, '732270d2-62e9-4334-b56f-90fb470939ae', '葡萄糖注射液', '葡萄糖注射液，适应症为1.补充能量和体液；用于各种原因引起的进食不足或大量体液丢失(如呕吐、腹泻等)，全静脉内营养，饥饿性酮症。2．低糖血症；3．高钾血症；4．高渗溶液用作组织脱水剂；5．配制腹膜透析液；6．药物稀释剂；7．静脉法葡萄糖耐量试验；8．供配制GIK(极化液)用。', 15.60, 192, '/images/upload_2acd9e5bff24cc2ee0e3d7b56f054024.jpg', '2020-10-18', '0');