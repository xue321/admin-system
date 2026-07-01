package com.admin.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

@Data
@TableName("error_question_tag")
public class ErrorQuestionTag {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long questionId;

    private Long tagId;
}
