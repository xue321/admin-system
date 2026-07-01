package com.admin.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.List;

@Data
public class UserRequest {
    @NotBlank(message = "用户名不能为空")
    private String username;
    private String password;
    private String nickname;
    private String email;
    private String phone;
    private Integer status;
    private List<Long> roleIds;
}
