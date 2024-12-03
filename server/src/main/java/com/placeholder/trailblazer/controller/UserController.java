package com.placeholder.trailblazer.controller;

import com.placeholder.trailblazer.model.User;
import com.placeholder.trailblazer.service.UserService;
import org.apache.logging.log4j.util.Strings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> findAll() {
        return userService.findAllUsers();
    }

    @CrossOrigin
    @GetMapping(value = "/{id}")
    public User findById(@PathVariable String id) {
        return userService.findUserById(id);
    }

    @CrossOrigin
    @GetMapping(value= "/email")
    public User findByEmail(@RequestParam(value="value") String email) {
        return userService.findByEmail(email);
    }

    @CrossOrigin
    @PostMapping
    public ResponseEntity<?> create(@RequestBody User user) {
        try {
            User createdUser = userService.createUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @CrossOrigin
    @PutMapping(value = "/{id}")
    public User update(@RequestBody User user, @PathVariable String id) {
        return userService.updateUser(user, id);
    }

    @CrossOrigin
    @DeleteMapping(value = "/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        userService.deleteUser(id);
    }

    @CrossOrigin
    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");
        User user = userService.findByUsername(username);
        System.out.println(username);
        System.out.println(password);
        System.out.println(user);
        if (user != null && userService.checkPassword(password, user.getPassword())) {
            System.out.println(user);
            return ResponseEntity.ok(user);
        } else {
            System.out.println("bad request");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @CrossOrigin
    @PostMapping("/{currentUserId}/follow/{userIdToFollow}")
    public ResponseEntity<User> followUser(@PathVariable String currentUserId, @PathVariable String userIdToFollow) {
        if(currentUserId.equals(userIdToFollow)){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        User updatedUser = userService.followUser(currentUserId, userIdToFollow);
        //check if now following user
        if(updatedUser == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        //good request
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @CrossOrigin
    @PostMapping("/{currentUserId}/unfollow/{userIdToUnfollow}")
    public ResponseEntity<User> unfollowUser(@PathVariable String currentUserId, @PathVariable String userIdToUnfollow) {
        if(currentUserId.equals(userIdToUnfollow)){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        User updatedUser = userService.unfollowUser(currentUserId, userIdToUnfollow);
        // Check if the user was successfully unfollowed
        if (updatedUser == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        // Good request
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @CrossOrigin
    @GetMapping("/{userId}/following")
    public ResponseEntity<List<User>> getFollowingUsers(@PathVariable String userId) {
        //maybe later it will be useful to return the entire user, for now just return a list of ids of the users they follow
        List<User> followingUsers = userService.getFollowingUsers(userId);

        return ResponseEntity.ok(followingUsers);
    }

    @CrossOrigin
    @GetMapping("/{userId}/followers")
    public ResponseEntity<List<User>> getFollowers(@PathVariable String userId) {
        //maybe later it will be useful to return the entire user, for now just return a list of ids of the users that follow them
        List<User> followers = userService.getFollowers(userId);
        return ResponseEntity.ok(followers);
    }

    @CrossOrigin
    @GetMapping("/{userId}/following/ids")
    public ResponseEntity<List<String>> getFollowingUserIds(@PathVariable String userId) {
        List<String> followingUserIds = userService.getFollowingUserIds(userId);
        return ResponseEntity.ok(followingUserIds);
    }

    @CrossOrigin
    @GetMapping("/{userId}/followers/ids")
    public ResponseEntity<List<String>> getFollowerUserIds(@PathVariable String userId) {
        List<String> followerUserIds = userService.getFollowerUserIds(userId);
        return ResponseEntity.ok(followerUserIds);
    }

    @CrossOrigin
    @PostMapping("/{userId}/save/{trailId}")
    public ResponseEntity<User> saveTrail(@PathVariable String userId, @PathVariable String trailId) {
        User updatedUser = userService.saveTrail(userId, trailId);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @CrossOrigin
    @PostMapping("/{userId}/unsave/{trailId}")
    public ResponseEntity<User> unsaveTrail(@PathVariable String userId, @PathVariable String trailId) {
        User updatedUser = userService.unsaveTrail(userId, trailId);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @CrossOrigin
    @GetMapping("/{userId}/saved-trails")
    public ResponseEntity<List<String>> getSavedTrails(@PathVariable String userId) {
        List<String> savedTrails = userService.getSavedTrails(userId);
        return new ResponseEntity<>(savedTrails, HttpStatus.OK);
    }
}
