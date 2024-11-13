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
    public Trail create(@RequestBody Trail trail) {
        return trailService.createTrail(trail);
    }

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
}
