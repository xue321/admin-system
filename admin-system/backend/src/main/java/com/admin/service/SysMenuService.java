package com.admin.service;

import com.admin.entity.SysMenu;
import com.baomidou.mybatisplus.extension.service.IService;
import java.util.List;

public interface SysMenuService extends IService<SysMenu> {
    List<SysMenu> getMenusByUserId(Long userId);
    List<String> getPermissionsByUserId(Long userId);
    List<SysMenu> getMenuTree();
}
