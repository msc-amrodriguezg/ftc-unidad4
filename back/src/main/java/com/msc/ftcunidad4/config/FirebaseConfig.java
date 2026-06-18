package com.msc.ftcunidad4.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;

import java.io.FileInputStream;
import java.io.IOException;

@Configuration
public class FirebaseConfig {

    @Value("${firebase.service-account-path:}")
    private String serviceAccountPath;

    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        if (!FirebaseApp.getApps().isEmpty()) {
            return FirebaseApp.getInstance();
        }

        FirebaseOptions.Builder optionsBuilder = FirebaseOptions.builder();
        if (StringUtils.hasText(serviceAccountPath)) {
            optionsBuilder.setCredentials(GoogleCredentials.fromStream(new FileInputStream(serviceAccountPath)));
        } else {
            optionsBuilder.setCredentials(GoogleCredentials.getApplicationDefault());
        }

        return FirebaseApp.initializeApp(optionsBuilder.build());
    }

    @Bean
    public Firestore firestore(FirebaseApp firebaseApp) {
        return FirestoreClient.getFirestore(firebaseApp);
    }
}
