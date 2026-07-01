package com.admin.service;

import com.admin.dto.LoginRequest;
import com.admin.dto.LoginResponse;
import com.admin.dto.UserRequest;
import com.admin.entity.SysUser;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;

public interface SysUserService extends IService<SysUser> {
    LoginResponse login(LoginRequest request);
    void createUser(UserRequest request);
    void updateUser(Long id, UserRequest request);
    IPage<SysUser> pageUsers(int page, int size, String username);
}
