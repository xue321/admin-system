package com.admin.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.admin.entity.ErrorTag;
import com.admin.dto.TagRequest;

import java.util.List;

public interface ErrorTagService extends IService<ErrorTag> {

    List<ErrorTag> getUserTags(Long userId);

    ErrorTag createTag(Long userId, TagRequest request);

    void updateTag(Long userId, Long id, TagRequest request);

    void deleteTag(Long userId, Long id);

    List<ErrorTag> getTagsByQuestionId(Long questionId);

    void setQuestionTags(Long userId, Long questionId, List<Long> tagIds);
}
