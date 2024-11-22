package com.placeholder.trailblazer.service;

import com.placeholder.trailblazer.model.User;
import com.placeholder.trailblazer.repository.UserRepository;
import com.placeholder.trailblazer.service.exceptions.ObjectNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.mindrot.jbcrypt.BCrypt;

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
    }
    public User followUser(String currentUserId, String userIdToFollow) {
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ObjectNotFoundException("User not found with id: " + currentUserId));
        User userToFollow = userRepository.findById(userIdToFollow)
                .orElseThrow(() -> new ObjectNotFoundException("User not found with id: " + userIdToFollow));
        // Create a new User object with only the required fields
        User followingUser = new User();
        followingUser.setId(userToFollow.getId());
        followingUser.setFirstName(userToFollow.getFirstName());
        followingUser.setLastName(userToFollow.getLastName());
        followingUser.setEmail(userToFollow.getEmail());
        // Add the user to the following list if not already present
        // Check if the user is already in the following list by matching the id
        boolean alreadyFollowing = currentUser.getFollowing().stream()
                .anyMatch(user -> user.getId().equals(followingUser.getId()));
        if (!alreadyFollowing) {
            currentUser.getFollowing().add(followingUser);
            userRepository.save(currentUser);
        }
        return currentUser;
    }
    public User unfollowUser(String currentUserId, String userIdToUnfollow) {
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ObjectNotFoundException("User not found with id: " + currentUserId));
        User userToUnfollow = userRepository.findById(userIdToUnfollow)
                .orElseThrow(() -> new ObjectNotFoundException("User not found with id: " + userIdToUnfollow));
        // Remove the user from the following list if present
        currentUser.getFollowing().removeIf(user -> user.getId().equals(userToUnfollow.getId()));
        userRepository.save(currentUser);
        return currentUser;
    }

    // Encrypts a user's password using BCrypt
    private String hashPassword(String plainTextPassword) {
        return BCrypt.hashpw(plainTextPassword, BCrypt.gensalt());
    }

    public boolean checkPassword(String plainPassword, String hashedPassword) {
        return BCrypt.checkpw(plainPassword, hashedPassword);
    }
}