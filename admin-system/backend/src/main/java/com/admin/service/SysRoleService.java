package com.admin.service;

import com.admin.dto.RoleRequest;
import com.admin.entity.SysRole;
import com.baomidou.mybatisplus.extension.service.IService;
import java.util.List;

public interface SysRoleService extends IService<SysRole> {
    void createRole(RoleRequest request);
    void updateRole(Long id, RoleRequest request);
    List<SysRole> getRolesByUserId(Long userId);
}
