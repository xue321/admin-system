package com.admin.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("error_tag")
public class ErrorTag {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;

    private String name;

    private String color;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
}
