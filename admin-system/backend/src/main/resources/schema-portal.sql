-- 错题本系统数据库表

-- 错题分类（树形结构）
CREATE TABLE IF NOT EXISTS `error_category` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL COMMENT '所属用户',
    `parent_id` BIGINT NOT NULL DEFAULT 0 COMMENT '父分类ID，0表示顶级',
    `name` VARCHAR(100) NOT NULL COMMENT '分类名称',
    `sort` INT NOT NULL DEFAULT 0 COMMENT '排序',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_user_parent` (`user_id`, `parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='错题分类';

-- 错题记录
CREATE TABLE IF NOT EXISTS `error_question` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL COMMENT '所属用户',
    `category_id` BIGINT NOT NULL COMMENT '分类ID',
    `title` VARCHAR(200) NOT NULL COMMENT '题目标题',
    `content` TEXT COMMENT '题目内容（富文本HTML）',
    `my_answer` TEXT COMMENT '我的错误答案',
    `correct_answer` TEXT COMMENT '正确答案',
    `note` TEXT COMMENT '笔记/讲解（富文本HTML）',
    `color_tag` VARCHAR(20) NOT NULL DEFAULT 'red' COMMENT '颜色标记',
    `status` TINYINT NOT NULL DEFAULT 0 COMMENT '0=未复习 1=复习中 2=已掌握',
    `strikethrough` TINYINT NOT NULL DEFAULT 0 COMMENT '是否加删除线',
    `review_count` INT NOT NULL DEFAULT 0 COMMENT '复习次数',
    `last_review_time` DATETIME COMMENT '最后复习时间',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_user_category` (`user_id`, `category_id`),
    INDEX `idx_user_status` (`user_id`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='错题记录';

-- 错题图片
CREATE TABLE IF NOT EXISTS `error_question_image` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `question_id` BIGINT NOT NULL COMMENT '错题ID',
    `user_id` BIGINT NOT NULL COMMENT '所属用户',
    `url` VARCHAR(500) NOT NULL COMMENT '图片存储路径',
    `sort` INT NOT NULL DEFAULT 0 COMMENT '排序',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_question` (`question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='错题图片';
