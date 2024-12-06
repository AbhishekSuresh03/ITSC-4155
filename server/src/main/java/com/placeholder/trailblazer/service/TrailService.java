package com.placeholder.trailblazer.service;

import com.placeholder.trailblazer.controller.TrailController;
import com.placeholder.trailblazer.model.Trail;
import com.placeholder.trailblazer.model.User;
import com.placeholder.trailblazer.repository.TrailRepository;
import com.placeholder.trailblazer.repository.UserRepository;
import com.placeholder.trailblazer.service.exceptions.ObjectNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class TrailService {
    @Autowired
    private TrailRepository trailRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserService userService;

    // CRUD Operations

    // CREATE METHODS
    public Trail createTrail(Trail trail, String ownerId) {

        User owner = userRepository.findById(ownerId).orElseThrow(
                () -> new ObjectNotFoundException("User not found! Id: " + ownerId + ", Type: " + User.class.getName()));

        // Set only the required fields in the owner object
        User ownerInfo = new User();
        ownerInfo.setUsername(owner.getUsername());
        ownerInfo.setFirstName(owner.getFirstName());
        ownerInfo.setLastName(owner.getLastName());
        ownerInfo.setProfilePicture(owner.getProfilePicture());
        ownerInfo.setId(owner.getId());

        //set default image if none was submitted, probably an error
        if(trail.getPrimaryImage() == null){
            trail.setPrimaryImage("https://cloudfront.traillink.com/photos/sligo-creek-trail_70435_sc.jpg");
        }
        //setting the image array from null to an empty array list if the field was not populated on submission
        if(trail.getImages() == null){
            trail.setImages(new ArrayList<>());
        }
        if(trail.getDescription() == null){
            trail.setDescription("");
        }


        //calculate pace
        if (trail.getLength() != null && trail.getTime() != null) {
            double pace = trail.getTime() / trail.getLength();
            trail.setPace(pace);
        }
        trail.setId(UUID.randomUUID().toString().split("-")[0]);
        trail.setOwner(ownerInfo);
        trail.setDate(new Date());
        return trailRepository.save(trail);
    }

    // READ METHODS
    public Trail findTrailById(String id) {
        return trailRepository.findById(id).orElseThrow(
                () -> new ObjectNotFoundException("Object not found! Id: " + id + ", Type: " + Trail.class.getName()));
    }

    public List<Trail> findTrailsByOwnerId(String ownerId) {
        return trailRepository.findByOwnerId(ownerId);
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
        trl.setPrimaryImage(trail.getPrimaryImage());
        trl.setOwner(trail.getOwner());
        trl.setDate(trail.getDate());
        trl.setDescription(trail.getDescription());
    }

    public List<Trail> findTrailsByFollowingUsers(String userId) {
        List<String> followingUserIds = userService.getFollowingUserIds(userId);
        return trailRepository.findAllByOwnerIdIn(followingUserIds);
    }
}