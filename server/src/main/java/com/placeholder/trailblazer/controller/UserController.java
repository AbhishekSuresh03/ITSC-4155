package com.placeholder.trailblazer.controller;

import com.placeholder.trailblazer.model.User;
import com.placeholder.trailblazer.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public User create(@RequestBody User user) {
        return userService.createUser(user);
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
}
