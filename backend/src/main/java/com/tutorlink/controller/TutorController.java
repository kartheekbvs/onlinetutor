package com.tutorlink.controller;

import com.tutorlink.model.User;
import com.tutorlink.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tutors")
@CrossOrigin(origins = "*")
public class TutorController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<User> getAllTutors() {
        return userRepository.findByRole("ROLE_TUTOR");
    }

    @PostMapping
    public User addTutor(@RequestBody User tutor) {
        tutor.setRole("ROLE_TUTOR");
        return userRepository.save(tutor);
    }

    @GetMapping("/search")
    public List<User> searchTutors(@RequestParam String subject) {
        return userRepository.findBySubjectsContaining(subject);
    }
}
