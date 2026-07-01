package com.admin.service;

import com.admin.entity.SysLog;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;

public interface SysLogService extends IService<SysLog> {
    IPage<SysLog> pageLogs(int page, int size, String username);
}
