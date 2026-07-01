package com.admin.dto;

import lombok.Data;

@Data
public class QuestionQueryRequest {

    private Long categoryId;

    private Integer status;

    private String colorTag;

    private String keyword;

    private Long tagId;

    private Integer page = 1;

    private Integer size = 10;
}
