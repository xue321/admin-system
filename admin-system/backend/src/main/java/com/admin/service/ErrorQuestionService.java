package com.admin.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.admin.entity.ErrorQuestion;
import com.admin.dto.QuestionRequest;
import com.admin.dto.QuestionQueryRequest;

import java.util.List;
import java.util.Map;

public interface ErrorQuestionService extends IService<ErrorQuestion> {

    IPage<ErrorQuestion> pageQuestions(Long userId, QuestionQueryRequest query);

    ErrorQuestion getQuestion(Long userId, Long id);

    ErrorQuestion createQuestion(Long userId, QuestionRequest request);

    void updateQuestion(Long userId, Long id, QuestionRequest request);

    void deleteQuestion(Long userId, Long id);

    void updateStatus(Long userId, Long id, Integer status, String colorTag, Integer strikethrough, Integer reviewCount);

    void markReviewed(Long userId, Long id);

    void markReviewedWithQuality(Long userId, Long id, int quality);

    List<ErrorQuestion> getDueForReview(Long userId);

    Map<String, Object> getStatistics(Long userId);

    Map<String, Object> getChartData(Long userId, int days);
}
