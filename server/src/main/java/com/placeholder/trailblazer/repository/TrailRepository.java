package com.placeholder.trailblazer.repository;

import com.placeholder.trailblazer.model.Trail;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface TrailRepository extends MongoRepository<Trail, String> {
    List<Trail> findByOwnerId(String ownerId);
}
