package com.klef.service;

import java.util.List;
import com.klef.entity.Volunteer;

public interface VolunteerService {
    Volunteer addVolunteer(Volunteer volunteer);
    List<Volunteer> getAllVolunteers();
    Volunteer getVolunteerById(int id);
    Volunteer updateVolunteer(Volunteer volunteer);
    void deleteVolunteerById(int id);
}
