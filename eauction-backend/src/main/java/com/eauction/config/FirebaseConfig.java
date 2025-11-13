package com.eauction.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import java.io.IOException;
import java.io.InputStream;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.util.StringUtils;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class FirebaseConfig {

    private final ResourceLoader resourceLoader;

    @Value("${firebase.credentials.path:}")
    private String credentialsPath;

    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        if (!FirebaseApp.getApps().isEmpty()) {
            return FirebaseApp.getInstance();
        }

        FirebaseOptions options;

        if (StringUtils.hasText(credentialsPath)) {
            Resource resource = resourceLoader.getResource(credentialsPath);
            if (!resource.exists()) {
                log.warn("Firebase credentials resource {} not found. Falling back to application default credentials.", credentialsPath);
                options = buildWithDefaultCredentials();
            } else {
                try (InputStream serviceAccount = resource.getInputStream()) {
                    options = FirebaseOptions.builder()
                            .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                            .build();
                    log.info("FirebaseApp initialized using credentials from {}", credentialsPath);
                }
            }
        } else {
            options = buildWithDefaultCredentials();
        }

        FirebaseApp app = FirebaseApp.initializeApp(options);
        log.debug("FirebaseApp initialized. Project id: {}", app.getOptions().getProjectId());
        return app;
    }

    private FirebaseOptions buildWithDefaultCredentials() throws IOException {
        return FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.getApplicationDefault())
                .build();
    }
}
