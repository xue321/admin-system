package com.admin.controller;

import com.admin.common.Result;
import com.admin.dto.TagRequest;
import com.admin.entity.ErrorTag;
import com.admin.security.JwtUtils;
import com.admin.service.ErrorTagService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/portal/tags")
@RequiredArgsConstructor
public class ErrorTagController {

    private final ErrorTagService tagService;
    private final JwtUtils jwtUtils;

    @GetMapping
    public Result<List<ErrorTag>> list(HttpServletRequest request) {
        Long userId = getCurrentUserId(request);
        return Result.success(tagService.getUserTags(userId));
    }

    @PostMapping
    public Result<ErrorTag> create(HttpServletRequest request, @Valid @RequestBody TagRequest dto) {
        Long userId = getCurrentUserId(request);
        return Result.success(tagService.createTag(userId, dto));
    }

    @PutMapping("/{id}")
    public Result<Void> update(HttpServletRequest request, @PathVariable Long id,
                               @Valid @RequestBody TagRequest dto) {
        Long userId = getCurrentUserId(request);
        tagService.updateTag(userId, id, dto);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(HttpServletRequest request, @PathVariable Long id) {
        Long userId = getCurrentUserId(request);
        tagService.deleteTag(userId, id);
        return Result.success();
    }

    @GetMapping("/questions/{questionId}")
    public Result<List<ErrorTag>> getQuestionTags(HttpServletRequest request,
                                                   @PathVariable Long questionId) {
        return Result.success(tagService.getTagsByQuestionId(questionId));
    }

    @PutMapping("/questions/{questionId}")
    public Result<Void> setQuestionTags(HttpServletRequest request,
                                        @PathVariable Long questionId,
                                        @RequestBody Map<String, List<Long>> body) {
        Long userId = getCurrentUserId(request);
        List<Long> tagIds = body.get("tagIds");
        tagService.setQuestionTags(userId, questionId, tagIds);
        return Result.success();
    }

    private Long getCurrentUserId(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        return jwtUtils.getUserIdFromToken(token);
    }
}
