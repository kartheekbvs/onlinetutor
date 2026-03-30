package com.tutorlink.config;

import com.tutorlink.model.User;
import com.tutorlink.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(UserRepository repository) {
        return args -> {
            if (repository.findByUsername("sample123@gmail.com").isEmpty()) {
                // Default Student
                repository.save(new User(null, "sample123@gmail.com", "123456", "sample123@gmail.com", "ROLE_STUDENT", "Sample User", "I love learning!", null, null));
                
                // Default Tutors
                repository.save(new User(null, "siva.charan@tutorlink.com", "tutor123", "siva@gmail.com", "ROLE_TUTOR", "Siva Charan", "Expert Java Developer with 8 years of experience in Spring Boot and Microservices.", "Java, Spring Boot, Hibernate", 55.0));
                repository.save(new User(null, "varsith@tutorlink.com", "tutor123", "varsith@gmail.com", "ROLE_TUTOR", "Varsith", "Data Scientist and Python enthusiast. Specialized in AI and ML.", "Python, Data Science, AI", 45.0));
                
                System.out.println("Default data pre-loaded successfully.");
            }
        };
    }
}
