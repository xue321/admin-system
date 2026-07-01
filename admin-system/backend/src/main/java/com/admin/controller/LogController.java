package com.admin.controller;

import com.admin.common.Result;
import com.admin.entity.SysLog;
import com.admin.service.SysLogService;
import com.baomidou.mybatisplus.core.metadata.IPage;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
public class LogController {

    private final SysLogService logService;

    @GetMapping
    @PreAuthorize("hasAuthority('system:log:list')")
    public Result<IPage<SysLog>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String username) {
        return Result.success(logService.pageLogs(page, size, username));
    }
}
