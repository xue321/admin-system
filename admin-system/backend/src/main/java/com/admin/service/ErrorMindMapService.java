package com.admin.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.admin.entity.ErrorMindMap;

import java.util.List;

public interface ErrorMindMapService extends IService<ErrorMindMap> {

    List<ErrorMindMap> getUserMindMaps(Long userId);

    ErrorMindMap getMindMap(Long userId, Long id);

    ErrorMindMap createMindMap(Long userId, String title, String data);

    void updateMindMap(Long userId, Long id, String title, String data);

    void deleteMindMap(Long userId, Long id);
}
