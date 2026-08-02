////package com.aws.google_login.config;
////import io.github.cdimascio.dotenv.Dotenv;
////import org.springframework.context.annotation.Configuration;
////import org.springframework.context.annotation.PropertySource;
////
////@Configuration
////@PropertySource(value = "file:.env", ignoreResourceNotFound = true)
////public class DotenvConfig {
////
////}
//
//package com.aws.google_login.config;
//
//import io.github.cdimascio.dotenv.Dotenv;
//import jakarta.annotation.PostConstruct;
//import org.springframework.stereotype.Component;
//
//@Component
//public class DotenvConfig {
//
//    @PostConstruct
//    public void loadEnv() {
//        try {
//            // Load file .env từ thư mục gốc project
//            Dotenv dotenv = Dotenv.configure()
//                    .directory("./")  // Thư mục gốc project
//                    .ignoreIfMissing() // Không throw exception nếu không có file
//                    .load();
//
//            // In ra các biến đã load để debug
//            System.out.println("=== Loading .env file ===");
//            dotenv.entries().forEach(entry -> {
//                String key = entry.getKey();
//                String value = entry.getValue();
//                if (value != null && !value.trim().isEmpty()) {
//                    System.setProperty(key, value);
//                    System.out.println("Loaded: " + key + "=" + value);
//                } else {
//                    System.err.println("WARNING: " + key + " is null or empty!");
//                }
//            });
//            System.out.println("=== .env loaded successfully ===");
//
//        } catch (Exception e) {
//            System.err.println("Error loading .env file: " + e.getMessage());
//            e.printStackTrace();
//        }
//    }
//}