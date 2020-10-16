create table medicine_shop
(
    id              bigint auto_increment comment '主键'
        primary key,
    shop_name       varchar(100)  null comment '药店名称',
    approve_status  varchar(2)    null comment '药店审批状态 0-提交 1-完成',
    shop_addr       varchar(200)  null comment '药店地址',
    shop_emps       int           null comment '药店人员数据量',
    shop_area       float         null comment '药店面积平方米',
    shop_cert       tinyint(1)    null comment '是否有资格证',
    approve_message varchar(1000) null comment '审批信息',
    username        varchar(100)  null comment '用户名'
)
    comment '药店表';

INSERT INTO medicine.medicine_shop (id, shop_name, approve_status, shop_addr, shop_emps, shop_area, shop_cert, approve_message, username) VALUES (1, '海王星辰药店', '0', '深圳市南山区深南大道57号', 20, 156, 1, null, 'abc');