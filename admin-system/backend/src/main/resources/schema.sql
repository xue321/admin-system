-- 创建数据库
CREATE DATABASE IF NOT EXISTS admin_system DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE admin_system;

-- 用户表
CREATE TABLE sys_user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    nickname VARCHAR(50),
    email VARCHAR(100),
    phone VARCHAR(20),
    status TINYINT DEFAULT 1 COMMENT '1:启用 0:禁用',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 角色表
CREATE TABLE sys_role (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role_key VARCHAR(50) NOT NULL UNIQUE,
    role_name VARCHAR(50) NOT NULL,
    description VARCHAR(200),
    status TINYINT DEFAULT 1,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 用户角色关联表
CREATE TABLE sys_user_role (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    UNIQUE KEY uk_user_role (user_id, role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 菜单/权限表
CREATE TABLE sys_menu (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    parent_id BIGINT DEFAULT 0,
    name VARCHAR(50) NOT NULL,
    path VARCHAR(200),
    component VARCHAR(200),
    permission VARCHAR(100),
    type TINYINT COMMENT '0:目录 1:菜单 2:按钮',
    icon VARCHAR(50),
    sort INT DEFAULT 0,
    status TINYINT DEFAULT 1,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 角色菜单关联表
CREATE TABLE sys_role_menu (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role_id BIGINT NOT NULL,
    menu_id BIGINT NOT NULL,
    UNIQUE KEY uk_role_menu (role_id, menu_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 操作日志表
CREATE TABLE sys_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    operation VARCHAR(200),
    method VARCHAR(10),
    params TEXT,
    ip VARCHAR(50),
    duration BIGINT,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========== 初始数据 ==========

-- 管理员账号 (密码: admin123)
INSERT INTO sys_user (username, password, nickname, status) VALUES
('admin', '$2a$10$N.ZOn9MHQFENRv/JE.SWJe7Rw7K/Zx3JfJNTrSZKYN.j3VpjM5Ge', '超级管理员', 1);

-- 角色
INSERT INTO sys_role (role_key, role_name, description) VALUES
('admin', '管理员', '系统管理员，拥有全部权限'),
('user', '普通用户', '普通用户，仅有查看权限');

-- 用户角色关联
INSERT INTO sys_user_role (user_id, role_id) VALUES (1, 1);

-- 菜单权限
INSERT INTO sys_menu (id, parent_id, name, path, component, permission, type, icon, sort) VALUES
(1,  0, '系统管理', '/system',     NULL,           NULL,                 0, 'SettingOutlined', 1),
(2,  1, '用户管理', '/system/user', 'User/index',   NULL,                 1, 'UserOutlined',    1),
(3,  1, '角色管理', '/system/role', 'Role/index',   NULL,                 1, 'TeamOutlined',    2),
(4,  1, '日志管理', '/system/log',  'Log/index',    NULL,                 1, 'FileTextOutlined',3),
(5,  2, '用户查询', NULL,           NULL,           'system:user:list',   2, NULL, 1),
(6,  2, '用户新增', NULL,           NULL,           'system:user:add',    2, NULL, 2),
(7,  2, '用户编辑', NULL,           NULL,           'system:user:edit',   2, NULL, 3),
(8,  2, '用户删除', NULL,           NULL,           'system:user:delete', 2, NULL, 4),
(9,  3, '角色查询', NULL,           NULL,           'system:role:list',   2, NULL, 1),
(10, 3, '角色新增', NULL,           NULL,           'system:role:add',    2, NULL, 2),
(11, 3, '角色编辑', NULL,           NULL,           'system:role:edit',   2, NULL, 3),
(12, 3, '角色删除', NULL,           NULL,           'system:role:delete', 2, NULL, 4),
(13, 4, '日志查询', NULL,           NULL,           'system:log:list',    2, NULL, 1);

-- 管理员角色关联全部菜单
INSERT INTO sys_role_menu (role_id, menu_id) VALUES
(1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(1,9),(1,10),(1,11),(1,12),(1,13);

-- 普通用户仅有查看权限
INSERT INTO sys_role_menu (role_id, menu_id) VALUES
(2,1),(2,2),(2,3),(2,4),(2,5),(2,9),(2,13);
