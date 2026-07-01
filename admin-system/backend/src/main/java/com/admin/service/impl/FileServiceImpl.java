package com.admin.service.impl;

import com.admin.service.FileService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileServiceImpl implements FileService {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    @Override
    public String uploadImage(MultipartFile file, Long userId) {
        if (file.isEmpty()) {
            throw new RuntimeException("文件不能为空");
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        String filename = userId + "/" + UUID.randomUUID() + extension;

        try {
            Path dir = Paths.get(uploadDir, userId.toString());
            if (!Files.exists(dir)) {
                Files.createDirectories(dir);
            }
            Path filePath = Paths.get(uploadDir, filename);
            Files.write(filePath, file.getBytes());
        } catch (IOException e) {
            throw new RuntimeException("文件上传失败", e);
        }

        return "/api/files/" + filename;
    }
}
