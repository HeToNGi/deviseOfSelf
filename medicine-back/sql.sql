CREATE TABLE `medicine_show` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `shop_name` varchar(100) DEFAULT NULL COMMENT '药店名称',
  `approve_status` varchar(2) DEFAULT NULL COMMENT '药店审批状态 0-提交 1-审核中 2-通过',
  `shop_addr` varchar(200) DEFAULT NULL COMMENT '药店地址',
  `shop_emps` int(11) DEFAULT NULL COMMENT '药店人员数据量',
  `shop_area` float DEFAULT NULL COMMENT '药店面积平方米',
  `shop_cert` varchar(2) DEFAULT NULL COMMENT '是否有资格证',
  `approve_messafe` varchar(1000) DEFAULT NULL COMMENT '审批信息',
  `approve_message` varchar(1000) DEFAULT NULL COMMENT '审批信息',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='药店表'


CREATE TABLE `medicine_users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `username` varchar(100) DEFAULT NULL COMMENT '用户名',
  `user_type` varchar(2) DEFAULT NULL COMMENT '用户类型 0-管理员 1-药店 2-用户',
  `user_password` varchar(200) DEFAULT NULL COMMENT '用户密码',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表'