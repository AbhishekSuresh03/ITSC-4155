package com.placeholder.trailblazer.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Trail")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Trail {

    @Id
    private ObjectId _id;
    private String name;
    private String city;
    private String state;
    private Double rating;
    private String difficulty;
    private Double length;
    private int time;
    private int pace;
    private String profilePic;
    private String userName;
    private Date date;
    private String description;
}
