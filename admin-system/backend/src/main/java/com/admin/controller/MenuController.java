package com.admin.controller;

import com.admin.common.Result;
import com.admin.entity.SysMenu;
import com.admin.service.SysMenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menus")
@RequiredArgsConstructor
public class MenuController {

    private final SysMenuService menuService;

    @GetMapping("/tree")
    public Result<List<SysMenu>> tree() {
        return Result.success(menuService.getMenuTree());
    }

    @GetMapping
    public Result<List<SysMenu>> list() {
        return Result.success(menuService.list());
    }
}
