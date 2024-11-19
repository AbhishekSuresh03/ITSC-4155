package com.placeholder.trailblazer.repository;

import com.placeholder.trailblazer.model.Trail;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface TrailRepository extends MongoRepository<Trail, String> {
    Trail findByUsername(String username);
}
