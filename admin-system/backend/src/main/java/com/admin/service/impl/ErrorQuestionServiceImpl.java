package com.admin.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.admin.dto.QuestionQueryRequest;
import com.admin.dto.QuestionRequest;
import com.admin.entity.ErrorCategory;
import com.admin.entity.ErrorQuestion;
import com.admin.entity.ErrorQuestionTag;
import com.admin.mapper.ErrorCategoryMapper;
import com.admin.mapper.ErrorQuestionMapper;
import com.admin.mapper.ErrorQuestionTagMapper;
import com.admin.service.ErrorQuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ErrorQuestionServiceImpl extends ServiceImpl<ErrorQuestionMapper, ErrorQuestion>
        implements ErrorQuestionService {

    private final ErrorQuestionTagMapper questionTagMapper;
    private final ErrorCategoryMapper categoryMapper;

    @Override
    public IPage<ErrorQuestion> pageQuestions(Long userId, QuestionQueryRequest query) {
        LambdaQueryWrapper<ErrorQuestion> wrapper = new LambdaQueryWrapper<ErrorQuestion>()
                .eq(ErrorQuestion::getUserId, userId)
                .eq(query.getStatus() != null, ErrorQuestion::getStatus, query.getStatus())
                .eq(StringUtils.hasText(query.getColorTag()), ErrorQuestion::getColorTag, query.getColorTag())
                .like(StringUtils.hasText(query.getKeyword()), ErrorQuestion::getTitle, query.getKeyword())
                .orderByDesc(ErrorQuestion::getCreateTime);

        if (query.getCategoryId() != null) {
            List<Long> categoryIds = new ArrayList<>();
            categoryIds.add(query.getCategoryId());
            collectChildCategoryIds(userId, query.getCategoryId(), categoryIds);
            wrapper.in(ErrorQuestion::getCategoryId, categoryIds);
        }

        if (query.getTagId() != null) {
            List<ErrorQuestionTag> relations = questionTagMapper.selectList(
                    new LambdaQueryWrapper<ErrorQuestionTag>()
                            .eq(ErrorQuestionTag::getTagId, query.getTagId()));
            if (relations.isEmpty()) {
                return new Page<>(query.getPage(), query.getSize());
            }
            List<Long> questionIds = relations.stream()
                    .map(ErrorQuestionTag::getQuestionId)
                    .collect(Collectors.toList());
            wrapper.in(ErrorQuestion::getId, questionIds);
        }

        return page(new Page<>(query.getPage(), query.getSize()), wrapper);
    }

    @Override
    public ErrorQuestion getQuestion(Long userId, Long id) {
        ErrorQuestion question = getById(id);
        if (question == null || !question.getUserId().equals(userId)) {
            throw new RuntimeException("错题不存在");
        }
        return question;
    }

    @Override
    public ErrorQuestion createQuestion(Long userId, QuestionRequest request) {
        ErrorQuestion question = new ErrorQuestion();
        question.setUserId(userId);
        question.setCategoryId(request.getCategoryId());
        question.setTitle(request.getTitle());
        question.setContent(request.getContent());
        question.setMyAnswer(request.getMyAnswer());
        question.setCorrectAnswer(request.getCorrectAnswer());
        question.setNote(request.getNote());
        question.setColorTag(request.getColorTag());
        question.setStatus(request.getStatus());
        question.setStrikethrough(request.getStrikethrough());
        question.setReviewCount(0);
        question.setNextReviewDate(LocalDate.now());
        question.setEaseFactor(new BigDecimal("2.50"));
        question.setIntervalDays(0);
        save(question);
        return question;
    }

    @Override
    public void updateQuestion(Long userId, Long id, QuestionRequest request) {
        ErrorQuestion question = getQuestion(userId, id);
        question.setCategoryId(request.getCategoryId());
        question.setTitle(request.getTitle());
        question.setContent(request.getContent());
        question.setMyAnswer(request.getMyAnswer());
        question.setCorrectAnswer(request.getCorrectAnswer());
        question.setNote(request.getNote());
        question.setColorTag(request.getColorTag());
        question.setStatus(request.getStatus());
        question.setStrikethrough(request.getStrikethrough());
        updateById(question);
    }

    @Override
    public void deleteQuestion(Long userId, Long id) {
        ErrorQuestion question = getQuestion(userId, id);
        removeById(question.getId());
    }

    @Override
    public void updateStatus(Long userId, Long id, Integer status, String colorTag, Integer strikethrough, Integer reviewCount) {
        ErrorQuestion question = getQuestion(userId, id);
        if (status != null) question.setStatus(status);
        if (colorTag != null) question.setColorTag(colorTag);
        if (strikethrough != null) question.setStrikethrough(strikethrough);
        if (reviewCount != null) {
            question.setReviewCount(Math.max(0, reviewCount));
            question.setLastReviewTime(LocalDateTime.now());
        }
        updateById(question);
    }

    @Override
    public void markReviewed(Long userId, Long id) {
        markReviewedWithQuality(userId, id, 4);
    }

    @Override
    public void markReviewedWithQuality(Long userId, Long id, int quality) {
        ErrorQuestion question = getQuestion(userId, id);
        question.setReviewCount(question.getReviewCount() + 1);
        question.setLastReviewTime(LocalDateTime.now());

        int intervalDays = question.getIntervalDays() != null ? question.getIntervalDays() : 0;
        BigDecimal easeFactor = question.getEaseFactor() != null ? question.getEaseFactor() : new BigDecimal("2.50");

        if (quality >= 3) {
            if (intervalDays == 0) {
                intervalDays = 1;
            } else if (intervalDays == 1) {
                intervalDays = 6;
            } else {
                intervalDays = Math.round(intervalDays * easeFactor.floatValue());
            }
            double ef = easeFactor.doubleValue() + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
            easeFactor = BigDecimal.valueOf(Math.max(1.3, ef)).setScale(2, RoundingMode.HALF_UP);
        } else {
            intervalDays = 1;
        }

        question.setIntervalDays(intervalDays);
        question.setEaseFactor(easeFactor);
        question.setNextReviewDate(LocalDate.now().plusDays(intervalDays));

        if (quality >= 4) {
            question.setStatus(2);
        } else if (quality >= 3) {
            question.setStatus(1);
        }

        updateById(question);
    }

    @Override
    public List<ErrorQuestion> getDueForReview(Long userId) {
        return list(new LambdaQueryWrapper<ErrorQuestion>()
                .eq(ErrorQuestion::getUserId, userId)
                .le(ErrorQuestion::getNextReviewDate, LocalDate.now())
                .ne(ErrorQuestion::getStatus, 2)
                .orderByAsc(ErrorQuestion::getNextReviewDate));
    }

    @Override
    public Map<String, Object> getStatistics(Long userId) {
        Map<String, Object> stats = new HashMap<>();

        long total = count(new LambdaQueryWrapper<ErrorQuestion>()
                .eq(ErrorQuestion::getUserId, userId));
        long unreviewed = count(new LambdaQueryWrapper<ErrorQuestion>()
                .eq(ErrorQuestion::getUserId, userId)
                .eq(ErrorQuestion::getStatus, 0));
        long reviewing = count(new LambdaQueryWrapper<ErrorQuestion>()
                .eq(ErrorQuestion::getUserId, userId)
                .eq(ErrorQuestion::getStatus, 1));
        long mastered = count(new LambdaQueryWrapper<ErrorQuestion>()
                .eq(ErrorQuestion::getUserId, userId)
                .eq(ErrorQuestion::getStatus, 2));
        long dueToday = count(new LambdaQueryWrapper<ErrorQuestion>()
                .eq(ErrorQuestion::getUserId, userId)
                .le(ErrorQuestion::getNextReviewDate, LocalDate.now())
                .ne(ErrorQuestion::getStatus, 2));

        stats.put("total", total);
        stats.put("unreviewed", unreviewed);
        stats.put("reviewing", reviewing);
        stats.put("mastered", mastered);
        stats.put("dueToday", dueToday);
        return stats;
    }

    @Override
    public Map<String, Object> getChartData(Long userId, int days) {
        Map<String, Object> result = new HashMap<>();
        LocalDateTime since = LocalDateTime.now().minusDays(days);

        List<ErrorQuestion> allQuestions = list(new LambdaQueryWrapper<ErrorQuestion>()
                .eq(ErrorQuestion::getUserId, userId));

        // Category distribution
        Map<Long, Long> categoryCount = allQuestions.stream()
                .collect(Collectors.groupingBy(ErrorQuestion::getCategoryId, Collectors.counting()));
        result.put("categoryDistribution", categoryCount);

        // Daily review activity (based on lastReviewTime)
        List<ErrorQuestion> reviewedRecently = allQuestions.stream()
                .filter(q -> q.getLastReviewTime() != null && q.getLastReviewTime().isAfter(since))
                .collect(Collectors.toList());

        Map<String, Long> dailyReviews = new LinkedHashMap<>();
        for (int i = days - 1; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            String dateStr = date.toString();
            long count = reviewedRecently.stream()
                    .filter(q -> q.getLastReviewTime().toLocalDate().equals(date))
                    .count();
            dailyReviews.put(dateStr, count);
        }
        result.put("dailyReviews", dailyReviews);

        // Mastery trend (cumulative mastered count per day)
        Map<String, Long> masteryTrend = new LinkedHashMap<>();
        long totalMastered = allQuestions.stream().filter(q -> q.getStatus() == 2).count();
        for (int i = days - 1; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            masteryTrend.put(date.toString(), totalMastered);
        }
        result.put("masteryTrend", masteryTrend);

        // Status distribution
        Map<String, Long> statusDist = new HashMap<>();
        statusDist.put("unreviewed", allQuestions.stream().filter(q -> q.getStatus() == 0).count());
        statusDist.put("reviewing", allQuestions.stream().filter(q -> q.getStatus() == 1).count());
        statusDist.put("mastered", allQuestions.stream().filter(q -> q.getStatus() == 2).count());
        result.put("statusDistribution", statusDist);

        return result;
    }

    private void collectChildCategoryIds(Long userId, Long parentId, List<Long> ids) {
        List<ErrorCategory> children = categoryMapper.selectList(
                new LambdaQueryWrapper<ErrorCategory>()
                        .eq(ErrorCategory::getUserId, userId)
                        .eq(ErrorCategory::getParentId, parentId));
        for (ErrorCategory child : children) {
            ids.add(child.getId());
            collectChildCategoryIds(userId, child.getId(), ids);
        }
    }
}
