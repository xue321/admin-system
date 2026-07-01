package com.admin.controller;

import com.admin.common.Result;
import com.admin.dto.CategoryRequest;
import com.admin.entity.ErrorCategory;
import com.admin.security.JwtUtils;
import com.admin.service.ErrorCategoryService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/portal/categories")
@RequiredArgsConstructor
public class ErrorCategoryController {

    private final ErrorCategoryService categoryService;
    private final JwtUtils jwtUtils;

    @GetMapping
    public Result<List<Map<String, Object>>> getTree(HttpServletRequest request) {
        Long userId = getCurrentUserId(request);
        return Result.success(categoryService.getCategoryTree(userId));
    }

    @GetMapping("/mind-map-data")
    public Result<List<Map<String, Object>>> getMindMapData(HttpServletRequest request) {
        Long userId = getCurrentUserId(request);
        return Result.success(categoryService.getMindMapData(userId));
    }

    @PostMapping
    public Result<ErrorCategory> create(HttpServletRequest request,
                                         @Valid @RequestBody CategoryRequest dto) {
        Long userId = getCurrentUserId(request);
        return Result.success(categoryService.createCategory(userId, dto));
    }

    @PutMapping("/{id}")
    public Result<Void> update(HttpServletRequest request,
                               @PathVariable Long id,
                               @Valid @RequestBody CategoryRequest dto) {
        Long userId = getCurrentUserId(request);
        categoryService.updateCategory(userId, id, dto);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(HttpServletRequest request, @PathVariable Long id) {
        Long userId = getCurrentUserId(request);
        categoryService.deleteCategory(userId, id);
        return Result.success();
    }

    private Long getCurrentUserId(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        return jwtUtils.getUserIdFromToken(token);
    }
}
