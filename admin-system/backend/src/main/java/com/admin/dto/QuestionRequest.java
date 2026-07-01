package com.admin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class QuestionRequest {

    @NotNull(message = "分类ID不能为空")
    private Long categoryId;

    @NotBlank(message = "题目标题不能为空")
    private String title;

    private String content;

    private String myAnswer;

    private String correctAnswer;

    private String note;

    private String colorTag = "red";

    private Integer status = 0;

    private Integer strikethrough = 0;
}
