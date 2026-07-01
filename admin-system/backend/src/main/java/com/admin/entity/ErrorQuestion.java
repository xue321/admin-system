package com.admin.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("error_question")
public class ErrorQuestion {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;

    private Long categoryId;

    private String title;

    private String content;

    private String myAnswer;

    private String correctAnswer;

    private String note;

    private String colorTag;

    private Integer status;

    private Integer strikethrough;

    private Integer reviewCount;

    private LocalDateTime lastReviewTime;

    private java.time.LocalDate nextReviewDate;

    private java.math.BigDecimal easeFactor;

    private Integer intervalDays;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}
