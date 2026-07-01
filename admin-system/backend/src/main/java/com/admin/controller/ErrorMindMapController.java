package com.admin.controller;

import com.admin.common.Result;
import com.admin.entity.ErrorMindMap;
import com.admin.security.JwtUtils;
import com.admin.service.ErrorMindMapService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/portal/mindmaps")
@RequiredArgsConstructor
public class ErrorMindMapController {

    private final ErrorMindMapService mindMapService;
    private final JwtUtils jwtUtils;

    @GetMapping
    public Result<List<ErrorMindMap>> list(HttpServletRequest request) {
        Long userId = getCurrentUserId(request);
        return Result.success(mindMapService.getUserMindMaps(userId));
    }

    @GetMapping("/{id}")
    public Result<ErrorMindMap> getById(HttpServletRequest request, @PathVariable Long id) {
        Long userId = getCurrentUserId(request);
        return Result.success(mindMapService.getMindMap(userId, id));
    }

    @PostMapping
    public Result<ErrorMindMap> create(HttpServletRequest request, @RequestBody Map<String, String> body) {
        Long userId = getCurrentUserId(request);
        String title = body.getOrDefault("title", "未命名导图");
        String data = body.get("data");
        return Result.success(mindMapService.createMindMap(userId, title, data));
    }

    @PutMapping("/{id}")
    public Result<Void> update(HttpServletRequest request, @PathVariable Long id,
                               @RequestBody Map<String, String> body) {
        Long userId = getCurrentUserId(request);
        mindMapService.updateMindMap(userId, id, body.get("title"), body.get("data"));
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(HttpServletRequest request, @PathVariable Long id) {
        Long userId = getCurrentUserId(request);
        mindMapService.deleteMindMap(userId, id);
        return Result.success();
    }

    private Long getCurrentUserId(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        return jwtUtils.getUserIdFromToken(token);
    }
}
