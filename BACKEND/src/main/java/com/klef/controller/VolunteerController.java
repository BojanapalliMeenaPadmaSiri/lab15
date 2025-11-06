package com.klef.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import com.klef.entity.Volunteer;
import com.klef.service.VolunteerService;

@RestController
@RequestMapping("/volunteerapi")
@CrossOrigin(origins = "*")
public class VolunteerController {

    @Autowired
    private VolunteerService volunteerService;

    @GetMapping("/")
    public String home() {
        return "Volunteer Tracker API is Running!";
    }

    @PostMapping("/add")
    public ResponseEntity<Volunteer> addVolunteer(@RequestBody Volunteer volunteer) {
        return new ResponseEntity<>(volunteerService.addVolunteer(volunteer), HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Volunteer>> getAllVolunteers() {
        return new ResponseEntity<>(volunteerService.getAllVolunteers(), HttpStatus.OK);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getVolunteerById(@PathVariable int id) {
        Volunteer volunteer = volunteerService.getVolunteerById(id);
        return volunteer != null ?
                new ResponseEntity<>(volunteer, HttpStatus.OK) :
                new ResponseEntity<>("Volunteer not found!", HttpStatus.NOT_FOUND);
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateVolunteer(@RequestBody Volunteer volunteer) {
        Volunteer existing = volunteerService.getVolunteerById(volunteer.getId());
        return existing != null ?
                new ResponseEntity<>(volunteerService.updateVolunteer(volunteer), HttpStatus.OK) :
                new ResponseEntity<>("Cannot update. Volunteer not found!", HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteVolunteer(@PathVariable int id) {
        Volunteer existing = volunteerService.getVolunteerById(id);
        if (existing != null) {
            volunteerService.deleteVolunteerById(id);
            return new ResponseEntity<>("Volunteer deleted successfully!", HttpStatus.OK);
        }
        return new ResponseEntity<>("Volunteer not found!", HttpStatus.NOT_FOUND);
    }
}
