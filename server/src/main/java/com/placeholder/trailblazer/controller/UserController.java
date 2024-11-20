package com.placeholder.trailblazer.controller;

import com.placeholder.trailblazer.model.User;
import com.placeholder.trailblazer.service.UserService;
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
}
