package com.placeholder.trailblazer.service;

import com.placeholder.trailblazer.model.Trail;
import com.placeholder.trailblazer.repository.TrailRepository;
import com.placeholder.trailblazer.service.exceptions.ObjectNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class TrailService {
    @Autowired
    private TrailRepository trailRepository;

    // CRUD Operations

    // CREATE METHODS
    public Trail createTrail(Trail trail) {
        trail.setId(UUID.randomUUID().toString().split("-")[0]);
        return trailRepository.save(trail);
    }

    // READ METHODS
    public Trail findTrailById(String id) {
        return trailRepository.findById(id).orElseThrow(
                () -> new ObjectNotFoundException("Object not found! Id: " + id + ", Type: " + Trail.class.getName()));
    }

    public Trail findTrailByUsername(String username) {
        Trail trail = trailRepository.findByUsername(username);
        if (trail == null) {
            throw new ObjectNotFoundException("Object not found! Username: " + username + ", Type: " + Trail.class.getName());
        }
        return trail;
    }

    public List<Trail> findAllTrails() {
        return trailRepository.findAll();
    }

    // UPDATE METHODS
    public Trail updateTrail(Trail trail, String id) {
        Trail trl = findTrailById(id);
        updateData(trail, trl);
        return trailRepository.save(trl);
    }

    // DELETE METHODS
    public void deleteTrail(String id) {
        trailRepository.delete(findTrailById(id));
    }

    // UTIL METHODS
    private void updateData(Trail trail, Trail trl) {
        trl.setName(trail.getName());
        trl.setCity(trail.getCity());
        trl.setState(trail.getState());
        trl.setRating(trail.getRating());
        trl.setDifficulty(trail.getDifficulty());
        trl.setLength(trail.getLength());
        trl.setTime(trail.getTime());
        trl.setPace(trail.getPace());
        trl.setImages(trail.getImages());
        trl.setUsername(trail.getUsername());
        trl.setDate(trail.getDate());
        trl.setDescription(trail.getDescription());
    }
}