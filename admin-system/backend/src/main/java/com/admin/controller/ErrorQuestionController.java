package com.admin.controller;

import com.admin.common.Result;
import com.admin.dto.QuestionQueryRequest;
import com.admin.dto.QuestionRequest;
import com.admin.entity.ErrorQuestion;
import com.admin.security.JwtUtils;
import com.admin.service.ErrorQuestionService;
import com.baomidou.mybatisplus.core.metadata.IPage;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/portal/questions")
@RequiredArgsConstructor
public class ErrorQuestionController {

    private final ErrorQuestionService questionService;
    private final JwtUtils jwtUtils;

    @GetMapping
    public Result<IPage<ErrorQuestion>> page(HttpServletRequest request, QuestionQueryRequest query) {
        Long userId = getCurrentUserId(request);
        return Result.success(questionService.pageQuestions(userId, query));
    }

    @GetMapping("/{id}")
    public Result<ErrorQuestion> getById(HttpServletRequest request, @PathVariable Long id) {
        Long userId = getCurrentUserId(request);
        return Result.success(questionService.getQuestion(userId, id));
    }

    @PostMapping
    public Result<ErrorQuestion> create(HttpServletRequest request,
                                         @Valid @RequestBody QuestionRequest dto) {
        Long userId = getCurrentUserId(request);
        return Result.success(questionService.createQuestion(userId, dto));
    }

    @PutMapping("/{id}")
    public Result<Void> update(HttpServletRequest request,
                               @PathVariable Long id,
                               @Valid @RequestBody QuestionRequest dto) {
        Long userId = getCurrentUserId(request);
        questionService.updateQuestion(userId, id, dto);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(HttpServletRequest request, @PathVariable Long id) {
        Long userId = getCurrentUserId(request);
        questionService.deleteQuestion(userId, id);
        return Result.success();
    }

    @PutMapping("/{id}/status")
    public Result<Void> updateStatus(HttpServletRequest request,
                                     @PathVariable Long id,
                                     @RequestBody Map<String, Object> body) {
        Long userId = getCurrentUserId(request);
        Integer status = body.get("status") != null ? (Integer) body.get("status") : null;
        String colorTag = (String) body.get("colorTag");
        Integer strikethrough = body.get("strikethrough") != null ? (Integer) body.get("strikethrough") : null;
        Integer reviewCount = body.get("reviewCount") != null ? (Integer) body.get("reviewCount") : null;
        questionService.updateStatus(userId, id, status, colorTag, strikethrough, reviewCount);
        return Result.success();
    }

    @PutMapping("/{id}/review")
    public Result<Void> markReviewed(HttpServletRequest request, @PathVariable Long id,
                                     @RequestBody(required = false) Map<String, Object> body) {
        Long userId = getCurrentUserId(request);
        int quality = 4;
        if (body != null && body.get("quality") != null) {
            quality = (Integer) body.get("quality");
        }
        questionService.markReviewedWithQuality(userId, id, quality);
        return Result.success();
    }

    @GetMapping("/due-review")
    public Result<List<ErrorQuestion>> dueForReview(HttpServletRequest request) {
        Long userId = getCurrentUserId(request);
        return Result.success(questionService.getDueForReview(userId));
    }

    @GetMapping("/statistics")
    public Result<Map<String, Object>> statistics(HttpServletRequest request) {
        Long userId = getCurrentUserId(request);
        return Result.success(questionService.getStatistics(userId));
    }

    @GetMapping("/chart-data")
    public Result<Map<String, Object>> chartData(HttpServletRequest request,
                                                  @RequestParam(defaultValue = "30") int days) {
        Long userId = getCurrentUserId(request);
        return Result.success(questionService.getChartData(userId, days));
    }

    private Long getCurrentUserId(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        return jwtUtils.getUserIdFromToken(token);
    }
}
