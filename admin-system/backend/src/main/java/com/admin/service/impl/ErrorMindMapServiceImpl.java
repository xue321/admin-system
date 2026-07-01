package com.admin.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.admin.entity.ErrorMindMap;
import com.admin.mapper.ErrorMindMapMapper;
import com.admin.service.ErrorMindMapService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ErrorMindMapServiceImpl extends ServiceImpl<ErrorMindMapMapper, ErrorMindMap>
        implements ErrorMindMapService {

    @Override
    public List<ErrorMindMap> getUserMindMaps(Long userId) {
        return list(new LambdaQueryWrapper<ErrorMindMap>()
                .eq(ErrorMindMap::getUserId, userId)
                .select(ErrorMindMap::getId, ErrorMindMap::getUserId, ErrorMindMap::getTitle,
                        ErrorMindMap::getCreateTime, ErrorMindMap::getUpdateTime)
                .orderByDesc(ErrorMindMap::getUpdateTime));
    }

    @Override
    public ErrorMindMap getMindMap(Long userId, Long id) {
        ErrorMindMap map = getById(id);
        if (map == null || !map.getUserId().equals(userId)) {
            throw new RuntimeException("思维导图不存在");
        }
        return map;
    }

    @Override
    public ErrorMindMap createMindMap(Long userId, String title, String data) {
        ErrorMindMap map = new ErrorMindMap();
        map.setUserId(userId);
        map.setTitle(title);
        map.setData(data);
        save(map);
        return map;
    }

    @Override
    public void updateMindMap(Long userId, Long id, String title, String data) {
        ErrorMindMap map = getMindMap(userId, id);
        if (title != null) map.setTitle(title);
        if (data != null) map.setData(data);
        updateById(map);
    }

    @Override
    public void deleteMindMap(Long userId, Long id) {
        ErrorMindMap map = getMindMap(userId, id);
        removeById(map.getId());
    }
}
