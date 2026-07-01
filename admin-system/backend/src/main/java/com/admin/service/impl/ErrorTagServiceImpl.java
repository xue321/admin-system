package com.admin.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.admin.dto.TagRequest;
import com.admin.entity.ErrorTag;
import com.admin.entity.ErrorQuestionTag;
import com.admin.mapper.ErrorTagMapper;
import com.admin.mapper.ErrorQuestionTagMapper;
import com.admin.service.ErrorTagService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ErrorTagServiceImpl extends ServiceImpl<ErrorTagMapper, ErrorTag>
        implements ErrorTagService {

    private final ErrorQuestionTagMapper questionTagMapper;

    @Override
    public List<ErrorTag> getUserTags(Long userId) {
        return list(new LambdaQueryWrapper<ErrorTag>()
                .eq(ErrorTag::getUserId, userId)
                .orderByDesc(ErrorTag::getCreateTime));
    }

    @Override
    public ErrorTag createTag(Long userId, TagRequest request) {
        ErrorTag tag = new ErrorTag();
        tag.setUserId(userId);
        tag.setName(request.getName());
        tag.setColor(request.getColor());
        save(tag);
        return tag;
    }

    @Override
    public void updateTag(Long userId, Long id, TagRequest request) {
        ErrorTag tag = getById(id);
        if (tag == null || !tag.getUserId().equals(userId)) {
            throw new RuntimeException("标签不存在");
        }
        tag.setName(request.getName());
        tag.setColor(request.getColor());
        updateById(tag);
    }

    @Override
    @Transactional
    public void deleteTag(Long userId, Long id) {
        ErrorTag tag = getById(id);
        if (tag == null || !tag.getUserId().equals(userId)) {
            throw new RuntimeException("标签不存在");
        }
        removeById(id);
        questionTagMapper.delete(new LambdaQueryWrapper<ErrorQuestionTag>()
                .eq(ErrorQuestionTag::getTagId, id));
    }

    @Override
    public List<ErrorTag> getTagsByQuestionId(Long questionId) {
        List<ErrorQuestionTag> relations = questionTagMapper.selectList(
                new LambdaQueryWrapper<ErrorQuestionTag>()
                        .eq(ErrorQuestionTag::getQuestionId, questionId));
        if (relations.isEmpty()) return Collections.emptyList();
        List<Long> tagIds = relations.stream()
                .map(ErrorQuestionTag::getTagId)
                .collect(Collectors.toList());
        return listByIds(tagIds);
    }

    @Override
    @Transactional
    public void setQuestionTags(Long userId, Long questionId, List<Long> tagIds) {
        questionTagMapper.delete(new LambdaQueryWrapper<ErrorQuestionTag>()
                .eq(ErrorQuestionTag::getQuestionId, questionId));
        if (tagIds != null && !tagIds.isEmpty()) {
            for (Long tagId : tagIds) {
                ErrorTag tag = getById(tagId);
                if (tag != null && tag.getUserId().equals(userId)) {
                    ErrorQuestionTag qt = new ErrorQuestionTag();
                    qt.setQuestionId(questionId);
                    qt.setTagId(tagId);
                    questionTagMapper.insert(qt);
                }
            }
        }
    }
}
