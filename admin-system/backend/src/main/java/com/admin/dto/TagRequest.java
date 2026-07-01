package com.admin.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TagRequest {

    @NotBlank(message = "标签名称不能为空")
    private String name;

    private String color = "#7C3AED";
}
