package com.klef.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.klef.entity.Volunteer;
import com.klef.repository.VolunteerRepository;

@Service
public class VolunteerServiceImpl implements VolunteerService {

    @Autowired
    private VolunteerRepository repo;

    @Override
    public Volunteer addVolunteer(Volunteer volunteer) {
        return repo.save(volunteer);
    }

    @Override
    public List<Volunteer> getAllVolunteers() {
        return repo.findAll();
    }

    @Override
    public Volunteer getVolunteerById(int id) {
        return repo.findById(id).orElse(null);
    }

    @Override
    public Volunteer updateVolunteer(Volunteer volunteer) {
        return repo.save(volunteer);
    }

    @Override
    public void deleteVolunteerById(int id) {
        repo.deleteById(id);
    }
}
