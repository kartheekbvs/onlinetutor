package com.tutorlink.repository;

import com.tutorlink.model.Booking;
import com.tutorlink.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByStudent(User student);
    List<Booking> findByTutor(User tutor);
    List<Booking> findByStatus(String status);
}
