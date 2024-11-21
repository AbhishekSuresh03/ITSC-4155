package com.placeholder.trailblazer.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document(collection = "Trails")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Trail {
    @Id
    private String id;
    private String name;
    private String city;
    private String state;
    private Double rating;
    private String difficulty;
    private Double length;
    private Double time;
    private Double pace;
    private List<String> images;
    private String primaryImage;
    private User owner;
    private Date date;
    private String description;
}
