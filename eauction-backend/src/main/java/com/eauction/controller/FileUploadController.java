package com.eauction.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
@Slf4j
public class FileUploadController {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    @PostMapping("/images")
    public ResponseEntity<?> uploadImages(@RequestParam("files") MultipartFile[] files) {
        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            List<String> imageUrls = new ArrayList<>();
            
            for (MultipartFile file : files) {
                if (file.isEmpty()) {
                    continue;
                }
                
                // Validate file is an image
                String contentType = file.getContentType();
                if (contentType == null || !contentType.startsWith("image/")) {
                    log.warn("Skipping non-image file: {}", file.getOriginalFilename());
                    continue;
                }
                
                // Generate unique filename
                String originalFilename = file.getOriginalFilename();
                String extension = "";
                if (originalFilename != null && originalFilename.contains(".")) {
                    extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                }
                String filename = UUID.randomUUID().toString() + extension;
                
                // Save file
                Path filePath = uploadPath.resolve(filename);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                
                // Generate absolute URL for frontend (different origin/port)
                String imageUrl = "http://localhost:8080/uploads/" + filename;
                imageUrls.add(imageUrl);
                
                log.info("Uploaded image: {} -> {}", originalFilename, imageUrl);
                System.out.println("Image saved at: " + filePath.toAbsolutePath() + " (public: " + imageUrl + ")");
            }
            
            if (imageUrls.isEmpty()) {
                return ResponseEntity.badRequest().body(java.util.Map.of("error", "No valid images uploaded"));
            }
            
            return ResponseEntity.ok(java.util.Map.of("urls", imageUrls));
            
        } catch (IOException e) {
            log.error("Error uploading files", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("error", "Failed to upload images: " + e.getMessage()));
        }
    }
}
