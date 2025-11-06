package com.klef.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.klef.entity.Volunteer;

public interface VolunteerRepository extends JpaRepository<Volunteer, Integer> {
}
