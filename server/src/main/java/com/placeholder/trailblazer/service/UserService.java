package com.placeholder.trailblazer.service;

import com.placeholder.trailblazer.model.User;
import com.placeholder.trailblazer.repository.UserRepository;
import com.placeholder.trailblazer.service.exceptions.ObjectNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.mindrot.jbcrypt.BCrypt;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    // CRUD Operations

    // CREATE METHODS
    public User createUser(User user) {
        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new IllegalArgumentException("Email already exists");
        }
        if (userRepository.findByUsername(user.getUsername()) != null) {
            throw new IllegalArgumentException("Username already exists");
        }
        //if there was an error uploading profile picture, it will set it to a default one
        if(user.getProfilePicture() == null){
            user.setProfilePicture("https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg");
        }
        //if submitted json has no following field, it will initialize it with an empty array
        if(user.getFollowing() == null){
            user.setFollowing(new ArrayList<String>());
        }
        //if submitted json has no followers field, it will initialize it with an empty array
        if(user.getFollowers() == null){
            user.setFollowers(new ArrayList<String>());
        }
        //if submitted json has no trails field, it will initialize it with an empty array
        if(user.getTrails() == null){
            user.setTrails(new ArrayList<String>());
        }

        user.setId(UUID.randomUUID().toString().split("-")[0]);
        user.setPassword(hashPassword(user.getPassword()));
        return userRepository.save(user);
    }

    // READ METHODS
    public User findUserById(String id) {
        return userRepository.findById(id).orElseThrow(
                () -> new ObjectNotFoundException("Object not found! Id: " + id + ", Type: " + User.class.getName()));
    }

    public User findByEmail(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new ObjectNotFoundException("Object not found! Email: " + email + ", Type: " + User.class.getName());
        }
        return user;
    }

    public User findByUsername(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new ObjectNotFoundException("Object not found! Username: " + username + ", Type: " + User.class.getName());
        }
        return user;
    }

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    // UPDATE METHODS
    public User updateUser(User user, String id) {
        //get user to update by its id
        //the passed in user object will have the updated data
        User existingUser = findUserById(id);
        updateData(existingUser, user);
        return userRepository.save(existingUser);
    }

    // DELETE METHODS
    public void deleteUser(String id) {
        userRepository.delete(findUserById(id));
    }

    // UTIL METHODS
    private void updateData(User existingUser, User newUser) {
        existingUser.setFirstName(newUser.getFirstName());
        existingUser.setLastName(newUser.getLastName());
        existingUser.setUsername(newUser.getUsername());
        existingUser.setEmail(newUser.getEmail());
        existingUser.setCity(newUser.getCity());
        existingUser.setState(newUser.getState());
        existingUser.setProfilePicture(newUser.getProfilePicture());
        existingUser.setTrails(newUser.getTrails());
        //TODO: Update this to accomodate new fields on User model
    }

    public User followUser(String currentUserId, String userIdToFollow) {
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ObjectNotFoundException("User not found with id: " + currentUserId));
        User userToFollow = userRepository.findById(userIdToFollow)
                .orElseThrow(() -> new ObjectNotFoundException("User not found with id: " + userIdToFollow));

        // Add the user to the following list if not already present
        // Check if the user is already in the following list by matching the id
        boolean alreadyFollowing = currentUser.getFollowing().contains(userIdToFollow);

        if (!alreadyFollowing) {
            //add user to follow to following list
            currentUser.getFollowing().add(userIdToFollow);
            userRepository.save(currentUser);
            //add current user to the user to follows followers list
            userToFollow.getFollowers().add(currentUserId);
            userRepository.save(userToFollow);

            return currentUser;
        }
        return null;

    }

    public User unfollowUser(String currentUserId, String userIdToUnfollow) {
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ObjectNotFoundException("User not found with id: " + currentUserId));
        User userToUnfollow = userRepository.findById(userIdToUnfollow)
                .orElseThrow(() -> new ObjectNotFoundException("User not found with id: " + userIdToUnfollow));

        // Check if the user is in the following list
        boolean isFollowing = currentUser.getFollowing().contains(userIdToUnfollow);

        if (isFollowing) {
            // Remove user from following list
            currentUser.getFollowing().remove(userIdToUnfollow);
            userRepository.save(currentUser);
            // Remove current user from the user to unfollow's followers list
            userToUnfollow.getFollowers().remove(currentUserId);
            userRepository.save(userToUnfollow);

            return currentUser;
        }
        return null;
    }

    public List<User> getFollowingUsers(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ObjectNotFoundException("User not found with id: " + userId));
        List<String> followingIds = user.getFollowing();
        return userRepository.findAllById(followingIds);
    }

    public List<User> getFollowers(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ObjectNotFoundException("User not found with id: " + userId));
        List<String> followerIds = user.getFollowers();
        return userRepository.findAllById(followerIds);
    }

    public List<String> getFollowingUserIds(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ObjectNotFoundException("User not found with id: " + userId));
        return user.getFollowing();
    }

    public List<String> getFollowerUserIds(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ObjectNotFoundException("User not found with id: " + userId));
        return user.getFollowers();
    }

    // Encrypts a user's password using BCrypt
    private String hashPassword(String plainTextPassword) {
        return BCrypt.hashpw(plainTextPassword, BCrypt.gensalt());
    }

    public boolean checkPassword(String plainPassword, String hashedPassword) {
        return BCrypt.checkpw(plainPassword, hashedPassword);
    }

    public User saveTrail(String userId, String trailId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ObjectNotFoundException("User not found with id: " + userId));

        if (!user.getSavedTrails().contains(trailId)) {
            user.getSavedTrails().add(trailId);
            userRepository.save(user);
        }

        return user;
    }

    public User unsaveTrail(String userId, String trailId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ObjectNotFoundException("User not found with id: " + userId));

        if (user.getSavedTrails().contains(trailId)) {
            user.getSavedTrails().remove(trailId);
            userRepository.save(user);
        }

        return user;
    }

    public List<String> getSavedTrails(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ObjectNotFoundException("User not found with id: " + userId));

        return user.getSavedTrails();
    }
}