package com.placeholder.trailblazer.repository;

import com.placeholder.trailblazer.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface UserRepository extends MongoRepository<User, String> {
//    @Query()
//    User findUserByName(String name);

    User findByEmail(String email);
}
