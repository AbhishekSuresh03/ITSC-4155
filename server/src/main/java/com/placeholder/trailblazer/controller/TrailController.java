package com.placeholder.trailblazer.controller;

import com.placeholder.trailblazer.model.Trail;
import com.placeholder.trailblazer.service.TrailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/trails")
public class TrailController {
    @Autowired
    private TrailService trailService;

    @CrossOrigin
    @GetMapping
    public List<Trail> findAll() {
        return trailService.findAllTrails();
    }

    @CrossOrigin
    @GetMapping(value = "/{id}")
    public Trail findById(@PathVariable String id) {
        return trailService.findTrailById(id);
    }

    @CrossOrigin
    @PostMapping
    public Trail create(@RequestBody Trail trail, @RequestParam String ownerId) {
        return trailService.createTrail(trail, ownerId);
    }

    @CrossOrigin
    @GetMapping(value = "/owner/{ownerId}")
    public List<Trail> findByOwnerId(@PathVariable String ownerId) {
        return trailService.findTrailsByOwnerId(ownerId);
    }

    @CrossOrigin
    @PutMapping(value = "/{id}")
    public Trail update(@RequestBody Trail trail, @PathVariable String id) {
        return trailService.updateTrail(trail, id);
    }

    @CrossOrigin
    @DeleteMapping(value = "/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        trailService.deleteTrail(id);
    }

    @CrossOrigin
    @GetMapping("/following/{userId}")
    public List<Trail> findTrailsByFollowingUsers(@PathVariable String userId) {
        return trailService.findTrailsByFollowingUsers(userId);
    }
}
