-- 错题本系统 第二期数据库变更

-- 标签表
CREATE TABLE IF NOT EXISTS `error_tag` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL COMMENT '所属用户',
    `name` VARCHAR(50) NOT NULL COMMENT '标签名称',
    `color` VARCHAR(20) NOT NULL DEFAULT '#7C3AED' COMMENT '标签颜色',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='错题标签';

-- 错题-标签关联表
CREATE TABLE IF NOT EXISTS `error_question_tag` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `question_id` BIGINT NOT NULL COMMENT '错题ID',
    `tag_id` BIGINT NOT NULL COMMENT '标签ID',
    PRIMARY KEY (`id`),
    UNIQUE INDEX `idx_question_tag` (`question_id`, `tag_id`),
    INDEX `idx_tag_id` (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='错题标签关联';

-- 间隔重复复习字段
ALTER TABLE `error_question`
    ADD COLUMN `next_review_date` DATE DEFAULT NULL COMMENT '下次复习日期',
    ADD COLUMN `ease_factor` DECIMAL(4,2) DEFAULT 2.50 COMMENT 'SM-2难度因子',
    ADD COLUMN `interval_days` INT DEFAULT 0 COMMENT '复习间隔天数';

CREATE INDEX `idx_eq_user_nextreview` ON `error_question`(`user_id`, `next_review_date`);
