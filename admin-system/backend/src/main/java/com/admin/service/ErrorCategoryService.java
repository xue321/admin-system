package com.admin.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.admin.entity.ErrorCategory;
import com.admin.dto.CategoryRequest;

import java.util.List;
import java.util.Map;

public interface ErrorCategoryService extends IService<ErrorCategory> {

    List<Map<String, Object>> getCategoryTree(Long userId);

    ErrorCategory createCategory(Long userId, CategoryRequest request);

    void updateCategory(Long userId, Long id, CategoryRequest request);

    void deleteCategory(Long userId, Long id);

    List<Map<String, Object>> getMindMapData(Long userId);
}
