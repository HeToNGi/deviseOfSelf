/*
 Navicat Premium Data Transfer

 Source Server         : 192.168.6.254-mysql57
 Source Server Type    : MySQL
 Source Server Version : 50730
 Source Host           : 192.168.6.254:33061
 Source Schema         : medicine

 Target Server Type    : MySQL
 Target Server Version : 50730
 File Encoding         : 65001

 Date: 15/10/2020 23:35:49
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for medicine_shop
-- ----------------------------
DROP TABLE IF EXISTS `medicine_shop`;
CREATE TABLE `medicine_shop`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `shop_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '药店名称',
  `approve_status` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '药店审批状态 0-提交 1-审核中 2-通过',
  `shop_addr` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '药店地址',
  `shop_emps` int(11) NULL DEFAULT NULL COMMENT '药店人员数据量',
  `shop_area` float NULL DEFAULT NULL COMMENT '药店面积平方米',
  `shop_cert` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '是否有资格证',
  `approve_message` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '审批信息',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '药店表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of medicine_shop
-- ----------------------------
INSERT INTO `medicine_shop` VALUES (1, '海王星辰药店', '0', '深圳市南山区深南大道57号', 20, 156, '1', NULL);

-- ----------------------------
-- Table structure for medicine_users
-- ----------------------------
DROP TABLE IF EXISTS `medicine_users`;
CREATE TABLE `medicine_users`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '用户名',
  `user_type` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '用户类型 0-管理员 1-药店 2-用户',
  `user_password` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '用户密码',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '用户表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of medicine_users
-- ----------------------------

SET FOREIGN_KEY_CHECKS = 1;
