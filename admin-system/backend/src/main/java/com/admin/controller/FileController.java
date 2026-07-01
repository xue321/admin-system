package com.admin.controller;

import com.admin.common.Result;
import com.admin.security.JwtUtils;
import com.admin.service.FileService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/portal/upload")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;
    private final JwtUtils jwtUtils;

    @PostMapping("/image")
    public Result<Map<String, String>> uploadImage(HttpServletRequest request,
                                                    @RequestParam("file") MultipartFile file) {
        Long userId = getCurrentUserId(request);
        String url = fileService.uploadImage(file, userId);
        Map<String, String> result = new HashMap<>();
        result.put("url", url);
        return Result.success(result);
    }

    private Long getCurrentUserId(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        return jwtUtils.getUserIdFromToken(token);
    }
}
