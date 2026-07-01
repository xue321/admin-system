package com.admin.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.admin.dto.CategoryRequest;
import com.admin.entity.ErrorCategory;
import com.admin.entity.ErrorQuestion;
import com.admin.mapper.ErrorCategoryMapper;
import com.admin.mapper.ErrorQuestionMapper;
import com.admin.service.ErrorCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ErrorCategoryServiceImpl extends ServiceImpl<ErrorCategoryMapper, ErrorCategory>
        implements ErrorCategoryService {

    private final ErrorQuestionMapper questionMapper;

    @Override
    public List<Map<String, Object>> getCategoryTree(Long userId) {
        List<ErrorCategory> all = list(new LambdaQueryWrapper<ErrorCategory>()
                .eq(ErrorCategory::getUserId, userId)
                .orderByAsc(ErrorCategory::getSort));

        return buildTree(all, 0L);
    }

    @Override
    public ErrorCategory createCategory(Long userId, CategoryRequest request) {
        ErrorCategory category = new ErrorCategory();
        category.setUserId(userId);
        category.setParentId(request.getParentId());
        category.setName(request.getName());
        category.setSort(request.getSort());
        save(category);
        return category;
    }

    @Override
    public void updateCategory(Long userId, Long id, CategoryRequest request) {
        ErrorCategory category = getById(id);
        if (category == null || !category.getUserId().equals(userId)) {
            throw new RuntimeException("分类不存在");
        }
        category.setName(request.getName());
        category.setParentId(request.getParentId());
        category.setSort(request.getSort());
        updateById(category);
    }

    @Override
    public void deleteCategory(Long userId, Long id) {
        ErrorCategory category = getById(id);
        if (category == null || !category.getUserId().equals(userId)) {
            throw new RuntimeException("分类不存在");
        }
        // 删除该分类及其子分类
        List<Long> idsToDelete = new ArrayList<>();
        collectChildIds(userId, id, idsToDelete);
        idsToDelete.add(id);
        removeByIds(idsToDelete);
    }

    private void collectChildIds(Long userId, Long parentId, List<Long> ids) {
        List<ErrorCategory> children = list(new LambdaQueryWrapper<ErrorCategory>()
                .eq(ErrorCategory::getUserId, userId)
                .eq(ErrorCategory::getParentId, parentId));
        for (ErrorCategory child : children) {
            ids.add(child.getId());
            collectChildIds(userId, child.getId(), ids);
        }
    }

    @Override
    public List<Map<String, Object>> getMindMapData(Long userId) {
        List<ErrorCategory> all = list(new LambdaQueryWrapper<ErrorCategory>()
                .eq(ErrorCategory::getUserId, userId)
                .orderByAsc(ErrorCategory::getSort));

        List<ErrorQuestion> questions = questionMapper.selectList(
                new LambdaQueryWrapper<ErrorQuestion>()
                        .eq(ErrorQuestion::getUserId, userId));

        Map<Long, Long> countMap = questions.stream()
                .collect(Collectors.groupingBy(ErrorQuestion::getCategoryId, Collectors.counting()));

        return buildMindMapTree(all, 0L, countMap);
    }

    private List<Map<String, Object>> buildMindMapTree(List<ErrorCategory> all, Long parentId, Map<Long, Long> countMap) {
        return all.stream()
                .filter(c -> c.getParentId().equals(parentId))
                .map(c -> {
                    Map<String, Object> node = new HashMap<>();
                    node.put("id", c.getId());
                    node.put("name", c.getName());
                    node.put("questionCount", countMap.getOrDefault(c.getId(), 0L));
                    node.put("children", buildMindMapTree(all, c.getId(), countMap));
                    return node;
                })
                .collect(Collectors.toList());
    }

    private List<Map<String, Object>> buildTree(List<ErrorCategory> all, Long parentId) {
        return all.stream()
                .filter(c -> c.getParentId().equals(parentId))
                .map(c -> {
                    Map<String, Object> node = new HashMap<>();
                    node.put("id", c.getId());
                    node.put("name", c.getName());
                    node.put("parentId", c.getParentId());
                    node.put("sort", c.getSort());
                    node.put("children", buildTree(all, c.getId()));
                    return node;
                })
                .collect(Collectors.toList());
    }
}
