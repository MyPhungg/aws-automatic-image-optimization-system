package com.aws.google_login;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class GoogleLoginApplication {

	public static void main(String[] args) {

        // Load .env file TRƯỚC KHI Spring Boot khởi động
        try {
            System.out.println("=== Loading .env file ===");

            Dotenv dotenv = Dotenv.configure()
                    .directory("./")  // Thư mục gốc project
                    .ignoreIfMissing() // Không lỗi nếu không có file
                    .load();

            // Đưa các biến vào System Properties để Spring Boot nhận
            dotenv.entries().forEach(entry -> {
                String key = entry.getKey();
                String value = entry.getValue();
                if (value != null && !value.trim().isEmpty()) {
                    System.setProperty(key, value);
                    System.out.println(" Loaded: " + key + "=" + value);
                } else {
                    System.out.println(" WARNING: " + key + " is empty");
                }
            });

            System.out.println("=== .env loaded successfully ===");
            System.out.println("AWS_REGION = " + System.getProperty("AWS_REGION"));

        } catch (Exception e) {
            System.err.println(" Error loading .env file: " + e.getMessage());
            // Không throw exception để ứng dụng vẫn chạy (dùng default values)
        }

        SpringApplication.run(GoogleLoginApplication.class, args);
	}

}
