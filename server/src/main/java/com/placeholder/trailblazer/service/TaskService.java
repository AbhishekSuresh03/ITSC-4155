package com.placeholder.trailblazer.service;
import com.placeholder.trailblazer.model.User;
import com.placeholder.trailblazer.repository.UserRepository;
import com.placeholder.trailblazer.service.exceptions.ObjectNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;
import org.mindrot.jbcrypt.BCrypt;

@Service
public class TaskService {
    @Autowired
    private UserRepository userRepository;

    //CRUD Operations

    //CREATE METHODS
    public User createUser(User user){
        user.setId(UUID.randomUUID().toString().split("-")[0]);
        user.setPassword(hashPassword(user.getPassword()));
        return userRepository.save(user);
    }

    //READ METHODS
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

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    //UPDATE METHODS
    public User updateUser(User user, String id) {
        User usr = findUserById(id);
        updateData(user, usr);
        return userRepository.save(usr);
    }

    //DELETE METHODS
    public void deleteUser(String id) {
        userRepository.delete(findUserById(id));
    }

    //UTIL METHODS
    private void updateData(User user, User usr) {
        usr.setEmail(user.getEmail());
        usr.setPassword(user.getPassword());
        usr.setUsername(user.getUsername());
        usr.setFirstName(user.getFirstName());
        usr.setLastName(user.getLastName());
    }

    // encrypts a user's password using BCrypt
    private String hashPassword(String plainTextPassword) {
        return BCrypt.hashpw(plainTextPassword, BCrypt.gensalt());
    }
}
